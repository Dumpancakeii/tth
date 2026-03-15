// models.go
package models

import (
    "time"
    "gorm.io/gorm"
)

type User struct {
    ID           uint           `gorm:"primarykey"`
    Email        string         `gorm:"uniqueIndex;size:255;not null"`
    PasswordHash string         `gorm:"not null"`
    FirstName    string         `gorm:"size:100"`
    LastName     string         `gorm:"size:100"`
    Phone        string         `gorm:"size:20"`
    Role         string         `gorm:"default:customer"`
    IsActive     bool           `gorm:"default:true"`
    Addresses    []Address      `gorm:"foreignKey:UserID"`
    Orders       []Order        `gorm:"foreignKey:UserID"`
    CreatedAt    time.Time
    UpdatedAt    time.Time
}

type Product struct {
    ID          uint           `gorm:"primarykey"`
    CategoryID  uint
    Name        string         `gorm:"size:255;not null"`
    Slug        string         `gorm:"uniqueIndex;size:255"`
    PriceUSD    float64        `gorm:"not null"`
    PriceRUB    float64
    Quantity    int            `gorm:"default:0"`
    Description string         `gorm:"type:text"`
    IsActive    bool           `gorm:"default:true"`
    Category    Category       `gorm:"foreignKey:CategoryID"`
    Variants    []ProductVariant
    Images      []ProductImage
    CreatedAt   time.Time
    UpdatedAt   time.Time
}

type Order struct {
    ID               uint           `gorm:"primarykey"`
    OrderNumber      string         `gorm:"uniqueIndex;size:50"`
    UserID           uint
    Status           string         `gorm:"default:pending"`
    PaymentStatus    string         `gorm:"default:pending"`
    ShippingStatus   string         `gorm:"default:pending"`
    Subtotal         float64
    DiscountAmount   float64        `gorm:"default:0"`
    ShippingAmount   float64        `gorm:"default:0"`
    TotalAmount      float64
    ShippingAddress  Address        `gorm:"foreignKey:ShippingAddressID"`
    TrackingNumber   string         `gorm:"size:100"`
    PaymentMethod    string
    Items            []OrderItem    `gorm:"foreignKey:OrderID"`
    CreatedAt        time.Time
    UpdatedAt        time.Time
}