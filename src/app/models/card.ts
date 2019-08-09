export default class CARD {
  // parms: suit -> spades, hearts, clubs, diams
  // parms: key  -> A, 1 - 10, J, Q, K
  private suit: string;
  private color: string;
  private key: string;
  private value: number;
  private imagePath: string;

  constructor(suit, key) {
    this.suit = suit;
    this.color = (suit[0] === "s" || suit[0] === "c") ? 'black' : 'red';
    this.key = key;
    this.value = this.valueOf(key);
    this.imagePath = `assets/images/cards/${key}${suit[0].toUpperCase()}.png`;
  }

  getColor()  {  return this.color  }
  getSuit()   {  return this.suit;  }
  getKey()    {  return this.key;   }
  getValue()  {  return this.value; }
  getImagePath() { return this.imagePath; }
  
  valueOf(key) {
    if (key === 'A') return 11;
    if ('JQK'.includes(key)) return 10;
    return +key;
  }
}
