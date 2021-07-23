export interface Cart {
  total: number;
  data: [
    {
      product: any;
      quantity: number;
    }
  ];
}
