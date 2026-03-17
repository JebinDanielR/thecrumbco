import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatbotService } from '../services/chatbot.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ChatbotComponent implements AfterViewChecked {

  @ViewChild('chatBody') chatBody!: ElementRef;

  message = '';
  messages: any[] = [];

  botTyping = false;
  isOpen = false;

  private shouldScroll = false;

  placeholderText = '';

  placeholders = [
    "Ask for cookies under 60...",
    "Show brownies above 100...",
    "Find cheap desserts...",
    "Show cupcakes...",
    "What desserts are under 80?"
  ];

  constructor(private chatbot: ChatbotService,private cartService: CartService,private router:Router) {
    this.rotatePlaceholder();
  }

 goToCart(){
  this.router.navigate(['/thecrumbco/cart']);
} 

  addToCart(product: any) {

  this.cartService.addToCart(product);

  const items = this.cartService.getCartItems();
  const total = this.cartService.getTotalPrice();

  const totalQty = items.reduce((sum, i) => sum + (i.qty || 1), 0);

  this.messages.push({
    sender: 'bot',
    text: `✅ ${product.name} added to cart\n🛒 ${totalQty} items | ₹${total}`,
    showCartButton: true   // 👈 important
  });

  this.shouldScroll = true;
}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  rotatePlaceholder() {

    let i = 0;

    this.placeholderText = this.placeholders[0];

    setInterval(() => {

      i = (i + 1) % this.placeholders.length;
      this.placeholderText = this.placeholders[i];

    }, 3500);

  }

  send(){

  if(!this.message.trim()) return;

  const userMessage = this.message;

  this.messages.push({
    sender:'user',
    text:userMessage
  });

  this.botTyping = true;

  this.chatbot.sendMessage(userMessage)
  .subscribe(res=>{

    setTimeout(()=>{

      this.botTyping = false;

      this.messages.push({
        sender:'bot',
        text:res.reply,
        products:res.products,
        suggestions:res.suggestions
      });

      this.shouldScroll = true;

    },800);

  });

  this.message='';

}

selectSuggestion(text:string){

  this.message = text;
  this.send();

}

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private scrollToBottom() {
    const el = this.chatBody.nativeElement;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }

}