// Starter content for the local JSON store, taken from the current live site.
import { randomUUID } from 'node:crypto';

export function seed() {
  const now = Date.now();
  const at = (i) => new Date(now - i * 60_000).toISOString();
  const cat = (name, parent_id = null, sort = 0) => ({ id: randomUUID(), name, parent_id, sort, created_at: at(0) });

  const tales = cat('ზღაპრები', null, 1);
  const friendship = cat('მეგობრობა', tales.id, 1);
  const magic = cat('ჯადოსნური ზღაპრები', tales.id, 2);
  const poems = cat('ლექსები', null, 2);
  const lullabies = cat('ძილისპირული', poems.id, 1);
  const funny = cat('მხიარული', poems.id, 2);

  const covers = 'https://nraykxancxojrvmcxsvj.supabase.co/storage/v1/object/public/book-covers';
  const product = (fields, i) => ({
    id: randomUUID(),
    description: '',
    content: '',
    cover_url: null,
    pdf_path: null,
    pdf_name: null,
    pages: null,
    age: '',
    featured: false,
    published: true,
    created_at: at(i),
    ...fields,
  });

  return {
    categories: [tales, friendship, magic, poems, lullabies, funny],
    products: [
      product({
        type: 'book',
        title: 'ნიკო და ცუგა',
        description:
          'ზღაპარი პატარა ნიკოსა და ლეკვის მეგობრობაზე, რომელიც ბიჭუნამ გადაარჩინა. ეს ზღაპარი ბავშვებში იწვევს ემპათიის გრძნობასა და სიყვარულს ცხოველების მიმართ.',
        price: 7,
        category_id: friendship.id,
        cover_url: `${covers}/1793647376892-4731.jpg`,
        pages: 10,
        age: '2–6 წელი',
        featured: true,
      }, 1),
      product({
        type: 'book',
        title: 'ჯადოსნური ვარსკვლავი',
        description:
          'ზღაპარი ბიჭუნაზე, რომელიც დედას არასდროს უჯერებს, თუმცა ერთ ღამესაც მასთან ჯადოსნური ვარსკვლავი გამოჩნდება და ისეთ თავგადასავალს ანახებს, რომელიც ბიჭუნას ცხოვრებას სრულიად შეცვლის.',
        price: 7,
        category_id: magic.id,
        cover_url: `${covers}/1793647880202-4581.jpg`,
        pages: 12,
        age: '2–4 წელი',
      }, 2),
      product({
        type: 'poem',
        title: 'ტკბილეული',
        description: 'მხიარული ლექსი პატარებისთვის.',
        content: 'ლექსის ტექსტი დაემატება ადმინ პანელიდან.',
        price: 0,
        category_id: funny.id,
      }, 3),
      product({
        type: 'poem',
        title: 'წვიმა',
        description: 'ნაზი ლექსი წვიმაზე.',
        content: 'ლექსის ტექსტი დაემატება ადმინ პანელიდან.',
        price: 0,
        category_id: lullabies.id,
      }, 4),
    ],
    banners: [
      {
        id: randomUUID(),
        title: 'მოდი, ერთად ვიმოგზაუროთ ზღაპრების სამყაროში!',
        subtitle: 'თითოეული ზღაპარი სიყვარულით შექმნილი პატარა სამყაროა, სადაც ბავშვები სწავლობენ სიკეთეს, მეგობრობასა და სიყვარულს.',
        button_text: 'აღმოაჩინე ზღაპრები',
        link: '/?type=book#products',
        image_url: `${covers}/1793647880202-4581.jpg`,
        active: true,
        sort: 1,
        created_at: at(0),
      },
    ],
  };
}
