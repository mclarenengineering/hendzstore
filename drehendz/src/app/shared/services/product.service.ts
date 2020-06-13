import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from 'angularfire2/database';
import {Product} from '../models/product';
import {AuthService} from './auth.service';
import {ToastrService} from './toastr.service';
import { ShoppingCartService } from './shopping-cart.service';


@Injectable ()
export class ProductService {
  
   
    products: AngularFireList<Product>;
    product: AngularFireObject<Product>;

    favoriteProducts: AngularFireList<FavoriteProduct>;
    cartProducts: AngularFireList<FavoriteProduct>
  
    navbarCartCount = 0;
    navbarFavProdCount = 0;

    constructor(
        private db: AngularFireDatabase,
        private authService: AuthService,
        private toastrService: ToastrService,
    )
    {
        this.calculateLocalFavProdCounts();
        this.calculateLocalCartProdCounts();
    }

    getProducts () {
        this.products = this.db.list('products');      

        return this.products;
    }

    createProduct(data: Product) {
        this.products.push(data);
    }
    getProductById(key: string) {
        this.product = this.db.object('/products/' + key);
        return this.product;
    }

    updateProduct(data: Product) {
        this.products.update(data.$key, data);
    }

    deleteProduct(key: string){
        this.products.remove(key);
    }





    // getUsersFavoriteProducts(){
    //     const user = this.authService.getLoggedInUser();
    //     this.favoriteProducts = this.db.list('favoriteProducts', 
    //     (ref)  =>  ref.orderByChild('userId')
    //     .equalTo(user.$key) );
    //     return this.favoriteProducts;
    // }


    addFavoriteProduct(data: Product): void {
        let a: Product [];
        a = JSON.parse(localStorage.getItem('avf_item')) || [];
        a.push(data);
          setTimeout(() => {
          localStorage.setItem('avf_item', JSON.stringify(a));
          this.calculateLocalFavProdCounts();
        }, 1500);
    }

getLocalFavoriteProducts(): Product[] {
    const products: Product [] = JSON.parse(localStorage.getItem('avf_item')) || [];

    return products;
}

removeFavorite(key: string){
    this.favoriteProducts.remove(key);
}

removeLocalFavorite(product: Product) {
    const products: Product[] = JSON.parse(localStorage.getItem('avf-item')) || [];

    for (let i = 0; i < products.length;  i++) {
        if (products[i].productId === product.productId) {
            products.splice(i,1);
            break;
        }
    }

    localStorage.setItem('avf_item', JSON.stringify(products));

this.calculateLocalFavProdCounts();
}

calculateLocalFavProdCounts() {
    this.navbarFavProdCount = this.getLocalFavoriteProducts().length
}


addToCart(product: Product): void {
    let a: Product[];

   a= JSON.parse(localStorage.getItem('cartId')) || [];
    a.push(product);
    
    setTimeout(()   => {
        localStorage.setItem('cartId', JSON.stringify(a));
        this.calculateLocalCartProdCounts();

    }, 500);

    
}

    getLocalCartProducts(): Product[] {
        const products: Product [] = JSON.parse(localStorage.getItem('cartId')) || [];

        return products;
    }

    calculateLocalCartProdCounts(){
        this.navbarCartCount = this.getLocalCartProducts().length;
    }

    removeLocalCartProduct(product: Product) {
        const products: Product[] = JSON.parse(localStorage.getItem('cartId'));
         console.log(products);
    
          for (let i = 0; i<products.length; i++) {
           if (products [i].productId === product.productId){
            products.splice(i, 1);
            break;
           }
       }
       localStorage.setItem('cartId', JSON.stringify(products));

		this.calculateLocalCartProdCounts();
    
    
      }

}

export class FavoriteProduct {
    product: Product;
    productId: string;
    userId: string;
}