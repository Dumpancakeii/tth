# models.py
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    phone = Column(String(20))
    role = Column(String(50), default="customer")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    addresses = relationship("Address", back_populates="user")
    orders = relationship("Order", back_populates="user")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True)
    price_usd = Column(Float, nullable=False)
    price_rub = Column(Float)
    quantity = Column(Integer, default=0)
    description = Column(String(1000))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    category = relationship("Category", back_populates="products")
    variants = relationship("ProductVariant", back_populates="product")
    images = relationship("ProductImage", back_populates="product")