// main.go
package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

var db *gorm.DB

func main() {
    // Подключение к БД
    dsn := "host=localhost user=postgres password=password dbname=bronze56k port=5432"
    db, _ = gorm.Open(postgres.Open(dsn), &gorm.Config{})
    
    r := gin.Default()
    
    // API роуты
    api := r.Group("/api")
    {
        // Товары
        api.GET("/products", getProducts)
        api.GET("/products/:id", getProduct)
        
        // Корзина
        api.POST("/cart/add", addToCart)
        api.GET("/cart", getCart)
        
        // Заказы
        api.POST("/orders", createOrder)
        api.GET("/orders", getUserOrders)
        
        // Админка
        admin := api.Group("/admin", authMiddleware("admin"))
        {
            admin.POST("/products", createProduct)
            admin.PUT("/products/:id", updateProduct)
            admin.DELETE("/products/:id", deleteProduct)
            admin.GET("/orders", getAllOrders)
            admin.PUT("/orders/:id/status", updateOrderStatus)
        }
    }
    
    r.Run(":8080")
}

// Получение списка товаров
func getProducts(c *gin.Context) {
    var products []models.Product
    category := c.Query("category")
    minPrice := c.Query("min_price")
    maxPrice := c.Query("max_price")
    
    query := db.Where("is_active = ?", true)
    
    if category != "" {
        query = query.Joins("Category").Where("Category.slug = ?", category)
    }
    
    query.Find(&products)
    c.JSON(http.StatusOK, products)
}

// Добавление в корзину
func addToCart(c *gin.Context) {
    var req struct {
        ProductID uint `json:"product_id"`
        Quantity  int  `json:"quantity"`
    }
    
    if err := c.BindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    userID := getCurrentUserID(c)
    
    // Получаем или создаем корзину
    var cart models.Cart
    db.Where("user_id = ?", userID).FirstOrCreate(&cart, models.Cart{UserID: userID})
    
    // Добавляем товар
    cart.Items = append(cart.Items, models.CartItem{
        ProductID: req.ProductID,
        Quantity:  req.Quantity,
    })
    
    db.Save(&cart)
    
    c.JSON(http.StatusOK, gin.H{"message": "Added to cart"})
}

// Создание заказа
func createOrder(c *gin.Context) {
    var req struct {
        ShippingAddressID uint   `json:"shipping_address_id"`
        PaymentMethod     string `json:"payment_method"`
    }
    
    if err := c.BindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    userID := getCurrentUserID(c)
    
    // Начинаем транзакцию
    tx := db.Begin()
    
    // Получаем корзину
    var cart models.Cart
    if err := tx.Where("user_id = ?", userID).First(&cart).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusBadRequest, gin.H{"error": "Cart is empty"})
        return
    }
    
    // Создаем заказ
    order := models.Order{
        OrderNumber:      generateOrderNumber(),
        UserID:           userID,
        Status:           "pending",
        PaymentStatus:    "pending",
        ShippingStatus:   "pending",
        Subtotal:         calculateSubtotal(cart),
        TotalAmount:      calculateTotal(cart),
        ShippingAddressID: req.ShippingAddressID,
        PaymentMethod:    req.PaymentMethod,
    }
    
    if err := tx.Create(&order).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    // Создаем элементы заказа
    for _, item := range cart.Items {
        orderItem := models.OrderItem{
            OrderID:   order.ID,
            ProductID: item.ProductID,
            Quantity:  item.Quantity,
            Price:     item.Price,
        }
        tx.Create(&orderItem)
    }
    
    // Очищаем корзину
    tx.Delete(&cart)
    
    tx.Commit()
    
    c.JSON(http.StatusOK, order)
}