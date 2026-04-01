const fs = require('fs');

const categories = ['Electronics', 'Lifestyle', 'Fashion', 'Home Decor', 'Gadgets', 'Wellness'];
const adjectives = ['Premium', 'Pro', 'Ultra', 'Sleek', 'Essential', 'Artisanal', 'Smart', 'Elite'];
const nouns = ['Watch', 'Lamp', 'Hoodie', 'Camera', 'Planter', 'Vase', 'Tote', 'Headphones'];

function generateProducts(count) {
  const products = [];
  for (let i = 1; i <= count; i++) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    products.push({
      id: `prod_${i}`,
      name: `${adj} ${noun} ${i}`,
      description: `Elevate your ${category.toLowerCase()} experience with the ${adj} ${noun}. Crafted for those who appreciate premium quality and sophisticated design.`,
      price: Math.floor(Math.random() * 9500) + 500,
      category: category,
      stock: Math.floor(Math.random() * 500) + 50,
      images: [`https://picsum.photos/seed/${i}/800/800`],
      rating: +(Math.random() * 2 + 3).toFixed(1),
      numReviews: Math.floor(Math.random() * 2000),
      featured: Math.random() > 0.9,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  return products;
}

const data = generateProducts(10000);
fs.writeFileSync('scripts/products_10k.json', JSON.stringify(data, null, 2));
console.log('✅ Generated 10,000 products: scripts/products_10k.json');
