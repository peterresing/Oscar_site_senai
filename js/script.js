const products = [
 {id:1,name:'Luminária de Saturno',category:'Decoração',price:39.99,image:'css/saturn-lamp.WEBP',description:'Uma luminária aconchegante inspirada nos anéis de Saturno.'},
 {id:2,name:'Kit Luneta 4 Peças',category:'Acessórios',price:189.99,image:'css/telescope-kit.WEBP',description:'Um kit para começar a observar o céu e seus detalhes.'},
 {id:3,name:'Estrelas Fluorescentes',category:'Decoração',price:9.99,image:'css/glow-stars.jpg',description:'Deixe seu quarto com um céu estrelado que brilha no escuro.'},
 {id:4,name:'Sorvete de Astronauta',category:'Colecionáveis',price:59.99,image:'css/astronaut-icecream.WEBP',description:'Uma guloseima temática para deixar sua coleção mais divertida.'},
 {id:5,name:'Capacete de Astronauta',category:'Colecionáveis',price:99.99,image:'css/astronaut-helmet.WEBP',description:'Um item decorativo para quem sonha em explorar o espaço.'},
 {id:6,name:'Globo Terra Giratório',category:'Acessórios',price:24.90,image:'css/globe.WEBP',description:'Explore os continentes com este globo clássico.'},
 {id:7,name:'Camiseta Astronauta',category:'Vestuário',price:59.99,image:'css/astronaut-shirt.jpg',description:'Camiseta preta com estampa espacial para usar no dia a dia.'}
];
let activeFilter='Todos';let cart=JSON.parse(localStorage.getItem('universalShopCart')||'[]');const grid=document.querySelector('#product-grid');const cartCount=document.querySelector('#cart-count');const cartItems=document.querySelector('#cart-items');const cartTotal=document.querySelector('#cart-total');const drawer=document.querySelector('#cart-drawer');const overlay=document.querySelector('#overlay');const toast=document.querySelector('#toast');
const money=value=>value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
function renderProducts(){let list=products.filter(p=>activeFilter==='Todos'||p.category===activeFilter);const sortControl=document.querySelector('#sort');const sort=sortControl?sortControl.value:'featured';if(sort==='low')list.sort((a,b)=>a.price-b.price);if(sort==='high')list.sort((a,b)=>b.price-a.price);grid.innerHTML=list.map(p=>`<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"></div><div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3><div class="product-buy"><span class="price">${money(p.price)}</span><button class="add-button" data-add="${p.id}">+ Adicionar</button></div></div></article>`).join('');}
function saveCart(){localStorage.setItem('universalShopCart',JSON.stringify(cart));}
function addToCart(id){const product=products.find(p=>p.id===id);const found=cart.find(item=>item.id===id);if(found)found.qty++;else cart.push({...product,qty:1});saveCart();renderCart();showToast(`${product.name} adicionado ao carrinho`);}
function removeFromCart(id){cart=cart.filter(item=>item.id!==id);saveCart();renderCart();}
function renderCart(){const count=cart.reduce((sum,item)=>sum+item.qty,0);cartCount.textContent=count;if(!cart.length){cartItems.innerHTML='<p class="empty-cart">Seu carrinho está vazio</p>';cartTotal.textContent=money(0);return;}cartItems.innerHTML=cart.map(item=>`<div class="cart-item"><img src="${item.image}" alt=""><div><h4>${item.name}</h4><p>${item.qty} × ${money(item.price)}</p><button class="remove-item" data-remove="${item.id}">Remover</button></div><strong>${money(item.price*item.qty)}</strong></div>`).join('');cartTotal.textContent=money(cart.reduce((sum,item)=>sum+item.price*item.qty,0));}
function openCart(){drawer.classList.add('open');overlay.classList.add('show');drawer.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
function closeCart(){drawer.classList.remove('open');overlay.classList.remove('show');drawer.setAttribute('aria-hidden','true');document.body.style.overflow='';}
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2300);}
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{activeFilter=button.dataset.filter;document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b===button));renderProducts();}));
const sortControl=document.querySelector('#sort');if(sortControl)sortControl.addEventListener('change',renderProducts);grid.addEventListener('click',event=>{const button=event.target.closest('[data-add]');if(button)addToCart(Number(button.dataset.add));});cartItems.addEventListener('click',event=>{const button=event.target.closest('[data-remove]');if(button)removeFromCart(Number(button.dataset.remove));});document.querySelector('#open-cart').addEventListener('click',openCart);document.querySelector('#close-cart').addEventListener('click',closeCart);overlay.addEventListener('click',closeCart);document.addEventListener('keydown',event=>{if(event.key==='Escape')closeCart();});const catalogView=document.querySelector('#produtos');
const finalizarView=document.querySelector('#finalizar-view');
const finalizarItems=document.querySelector('#finalizar-items');
const finalizarTotal=document.querySelector('#finalizar-total');
const confirmOrderButton=document.querySelector('#confirm-order');
const finalizarMessage=document.querySelector('#finalizar-message');
function renderFinalizar(){
  if(!cart.length){finalizarItems.innerHTML='<p class="empty-finalizar">Seu carrinho está vazio. Volte à loja para adicionar produtos.</p>';finalizarTotal.textContent=money(0);confirmOrderButton.disabled=true;return;}
  confirmOrderButton.disabled=false;
  finalizarItems.innerHTML=cart.map(item=>`<article class="finalizar-product"><img src="${item.image}" alt="${item.name}"><div><h3>${item.name}</h3><p>Quantidade: ${item.qty} · ${money(item.price)} cada</p></div><strong>${money(item.price*item.qty)}</strong></article>`).join('');
  finalizarTotal.textContent=money(cart.reduce((sum,item)=>sum+item.price*item.qty,0));
}
function showFinalizar(){closeCart();renderFinalizar();catalogView.hidden=true;finalizarView.hidden=false;window.scrollTo({top:0,behavior:'smooth'});}
function showCatalog(){finalizarView.hidden=true;catalogView.hidden=false;finalizarMessage.classList.remove('show');confirmOrderButton.style.display='';window.scrollTo({top:0,behavior:'smooth'});}
document.querySelector('#finalizar').addEventListener('click',()=>{if(!cart.length){showToast('Adicione um produto antes de finalizar.');return;}showFinalizar();});
document.querySelector('#back-to-store').addEventListener('click',showCatalog);
confirmOrderButton.addEventListener('click',()=>{if(!cart.length)return;const orderTotal=cart.reduce((sum,item)=>sum+item.price*item.qty,0);cart=[];saveCart();renderCart();renderFinalizar();confirmOrderButton.style.display='none';finalizarMessage.textContent=`O total da compra foi: ${money(orderTotal)}. Pedido finalizado.`;finalizarMessage.classList.add('show');});
renderProducts();renderCart()