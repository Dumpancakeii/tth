// app/Models/User.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    protected $fillable = [
        'email', 'password_hash', 'first_name', 
        'last_name', 'phone', 'role', 'is_active'
    ];
    
    protected $hidden = ['password_hash'];
    
    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime'
    ];
    
    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }
    
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}

// app/Models/Product.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'category_id', 'name', 'slug', 'price_usd', 'price_rub',
        'quantity', 'description', 'is_active', 'is_featured'
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'price_usd' => 'float',
        'price_rub' => 'float'
    ];
    
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
    
    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }
    
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }
    
    // Аксессор для доступного количества
    public function getAvailableQuantityAttribute(): int
    {
        return $this->quantity - $this->reserved_quantity;
    }
    
    // Скоуп для активных товаров
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    // Скоуп для новинок
    public function scopeNew($query)
    {
        return $query->where('is_new', true);
    }
}

// app/Models/Order.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number', 'user_id', 'status', 'payment_status',
        'shipping_status', 'subtotal', 'total_amount',
        'shipping_address_id', 'tracking_number', 'payment_method'
    ];
    
    protected $casts = [
        'subtotal' => 'float',
        'total_amount' => 'float',
        'created_at' => 'datetime'
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
    
    public function shippingAddress()
    {
        return $this->belongsTo(Address::class, 'shipping_address_id');
    }
    
    // Генерация номера заказа
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($order) {
            $order->order_number = 'ORD-' . date('Y') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
        });
    }
}