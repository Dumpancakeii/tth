# main.py
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import models
import schemas

app = FastAPI()

# Зависимость для получения сессии БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Товары
@app.get("/api/products", response_model=List[schemas.Product])
def get_products(
    category: str = None,
    min_price: float = None,
    max_price: float = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Product).filter(models.Product.is_active == True)
    
    if category:
        query = query.join(models.Category).filter(models.Category.slug == category)
    if min_price:
        query = query.filter(models.Product.price_rub >= min_price)
    if max_price:
        query = query.filter(models.Product.price_rub <= max_price)
    
    return query.all()

@app.get("/api/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).get(product_id)
    if not product:
        raise HTTPException(404, "Product not found")
    return product

# Корзина
@app.post("/api/cart/add")
def add_to_cart(
    product_id: int,
    quantity: int = 1,
    variant_id: int = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    cart = get_or_create_cart(db, current_user.id)
    
    # Добавляем товар в корзину
    cart_item = {
        "product_id": product_id,
        "variant_id": variant_id,
        "quantity": quantity
    }
    
    cart.items.append(cart_item)
    db.commit()
    
    return {"message": "Added to cart"}

# Заказы
@app.post("/api/orders")
def create_order(
    shipping_address_id: int,
    payment_method: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Получаем корзину
    cart = get_cart(db, current_user.id)
    
    # Создаем заказ
    order = models.Order(
        user_id=current_user.id,
        subtotal=cart.subtotal,
        total=cart.total,
        status="pending",
        shipping_address_id=shipping_address_id,
        payment_method=payment_method
    )
    
    db.add(order)
    db.flush()
    
    # Добавляем товары из корзины в заказ
    for item in cart.items:
        order_item = models.OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price
        )
        db.add(order_item)
    
    # Очищаем корзину
    cart.items = []
    db.commit()
    
    return order