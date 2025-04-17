export class IdleState {
    readonly type = "idle";
  }
  
  export class PlayingState {
    readonly type = "playing";
  }
  
  export class ResultState {
    readonly type = "result";
    constructor(public resultado: string, public ganhou: boolean) {}
  }
  