<?php
// app/Http/Controllers/ProductController.php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::active()->with(['category', 'images']);
        
        // Фильтр по категории
        if ($request->has('category')) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }
        
        // Фильтр по цене
        if ($request->has('min_price')) {
            $query->where('price_rub', '>=', $request->min_price);
        }
        
        if ($request->has('max_price')) {
            $query->where('price_rub', '<=', $request->max_price);
        }
        
        // Поиск
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        
        // Сортировка
        $sort = $request->get('sort', 'created_at');
        $order = $request->get('order', 'desc');
        $query->orderBy($sort, $order);
        
        $products = $query->paginate(12);
        
        return response()->json($products);
    }
    
    public function show($id)
    {
        $product = Product::with(['category', 'variants', 'images'])
            ->active()
            ->findOrFail($id);
            
        return response()->json($product);
    }
}

// app/Http/Controllers/CartController.php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function getCart()
    {
        $cart = $this->getOrCreateCart();
        return response()->json($cart);
    }
    
    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1|max:10',
            'variant_id' => 'nullable|exists:product_variants,id'
        ]);
        
        $cart = $this->getOrCreateCart();
        $product = Product::findOrFail($request->product_id);
        
        // Проверяем наличие
        if (!$product->inStock()) {
            return response()->json(['error' => 'Product out of stock'], 400);
        }
        
        // Добавляем товар
        $cart->addItem(
            $product,
            $request->quantity,
            $request->variant_id
        );
        
        return response()->json([
            'message' => 'Product added to cart',
            'cart' => $cart->load('items')
        ]);
    }
    
    public function updateItem(Request $request, $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:10'
        ]);
        
        $cart = $this->getOrCreateCart();
        $cart->updateItemQuantity($itemId, $request->quantity);
        
        return response()->json($cart);
    }
    
    public function removeItem($itemId)
    {
        $cart = $this->getOrCreateCart();
        $cart->removeItem($itemId);
        
        return response()->json(['message' => 'Item removed']);
    }
    
    private function getOrCreateCart()
    {
        if (Auth::check()) {
            // Для авторизованных - привязана к пользователю
            return Cart::firstOrCreate(
                ['user_id' => Auth::id()],
                ['items' => []]
            );
        } else {
            // Для гостей - по session_id
            $sessionId = session()->getId();
            return Cart::firstOrCreate(
                ['session_id' => $sessionId],
                ['items' => []]
            );
        }
    }
}

// app/Http/Controllers/OrderController.php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->with(['items', 'shippingAddress'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($orders);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'shipping_address_id' => 'required|exists:addresses,id',
            'payment_method' => 'required|in:card,sbp,yandex'
        ]);
        
        $cart = Cart::where('user_id', Auth::id())->first();
        
        if (!$cart || empty($cart->items)) {
            return response()->json(['error' => 'Cart is empty'], 400);
        }
        
        DB::beginTransaction();
        
        try {
            // Создаем заказ
            $order = Order::create([
                'user_id' => Auth::id(),
                'shipping_address_id' => $request->shipping_address_id,
                'payment_method' => $request->payment_method,
                'subtotal' => $cart->subtotal,
                'total_amount' => $cart->total,
                'status' => 'pending',
                'payment_status' => 'pending',
                'shipping_status' => 'pending'
            ]);
            
            // Переносим товары из корзины в заказ
            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id' => $item['product_id'],
                    'variant_id' => $item['variant_id'] ?? null,
                    'product_name' => $item['name'],
                    'quantity' => $item['quantity'],
                    'price_per_unit' => $item['price'],
                    'total_price' => $item['price'] * $item['quantity']
                ]);
                
                // Уменьшаем количество товара на складе
                $product = Product::find($item['product_id']);
                $product->decrement('quantity', $item['quantity']);
                $product->increment('reserved_quantity', $item['quantity']);
            }
            
            // Очищаем корзину
            $cart->delete();
            
            DB::commit();
            
            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order->load('items')
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Order creation failed'], 500);
        }
    }
    
    public function show($id)
    {
        $order = Order::where('user_id', Auth::id())
            ->with(['items', 'shippingAddress'])
            ->findOrFail($id);
            
        return response()->json($order);
    }
}