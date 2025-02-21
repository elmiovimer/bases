import { Models } from "./models";

export const DataDemo2: Models.Store.Item[] =[]
export const DataDemo: Models.Store.Item[] = [
    {
      id: '0001',
      name: 'Hamburguesa',
      desc: 'Con queso, salsas, papas',
      price: 7.50,
      image: '/assets/images/hamburguesa.webp',

      stock: 0,
    //   categories: [],
    //   enable: true,
    },
    {
      id: '0002',
      name: 'Hamburguesa Especial',
      desc: 'hamburgues con salsa a la mamañema.',
      price: 9.50,
      // image: '/assets/images/hamburguesa.webp'
      stock: 10,
    //   categories: [],
    //   enable: true,
    },
    {
      id: '0003',
      name: 'Hamburguesa Doble',
      desc: 'con doble carne.',
      price: 11.50,
      image: '/assets/images/hamburguesa.webp',
      stock: 2,
    //   categories: [],
    //   enable: true,
    }
  ];
