export default class Piece {
  constructor(type, color, position) {
    this.type = type;
    this.color = color;
    this.position = position;
    this.moveArr = this.#getMoveArr(this.type, this.color);
    this.canExtendMove = this.#getCanExtendMove(this.type);
    this.imageUrl = `/${this.type}-${this.color}.svg`;
  }

  // static init function
  #getMoveArr(type, color) {
    switch (type) {
      case 'pawn': {
        if (color === 'white') {
          return [
            [-1, -1],
            [-1, 1],
          ];
        }
        if (color === 'black') {
          return [
            [1, -1],
            [1, 1],
          ];
        }
      }
      case 'knight': {
        return [
          [2, -1],
          [2, 1],
          [1, -2],
          [1, 2],
          [-1, -2],
          [-1, 2],
          [-2, -1],
          [-2, 1],
        ];
      }
      case 'bishop': {
        return [
          [1, -1],
          [1, 1],
          [-1, -1],
          [-1, 1],
        ];
      }
      case 'rook': {
        return [
          [1, 0],
          [0, -1],
          [0, 1],
          [-1, 0],
        ];
      }
      case 'queen': {
        return [
          [1, -1],
          [1, 0],
          [1, 1],
          [0, -1],
          [0, 1],
          [-1, -1],
          [-1, 0],
          [-1, 1],
        ];
      }
      case 'king': {
        return [
          [1, -1],
          [1, 0],
          [1, 1],
          [0, -1],
          [0, 1],
          [-1, -1],
          [-1, 0],
          [-1, 1],
        ];
      }
      default: {
        throw new Error('unexpected type provided');
      }
    }
  }

  // static init function
  #getCanExtendMove(type) {
    return type === 'bishop' || type === 'rook' || type === 'queen';
  }
}
