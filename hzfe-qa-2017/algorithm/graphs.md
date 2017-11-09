# 算法：无向图的广度优先和深度优先

## 引言

图是算法图中的基本模型之一，由一组顶点和一组能够将顶点相连的边共同组成了图。无向图顾名思义，其边是没有任何方向的，即 v-w 和 w-v 是同一条边的两种不同表达。

在无向图中，广度优先搜索和深度优先搜索是两个最基本的算法，他们分别可以解决以下问题：

- 给定一幅图，两个给定的顶点是否联通/图中有多少个连通子图？
- 给定一幅图和起点s，从s到给定顶点v是否存在一条最短路径？

本文将通过js详细实现这两个算法。

## 图的定义

为了方便，本文将顶点总数为V的图的各个顶点以 0- V-1标记。无向图的实现如下：

```typescript
class Graph implements Graph {
  private _V:number; //顶点数目
  private _E: number=0; //边数目
  private _adj:Array<Array<number>>; //邻接表
  constructor(V: number) {
    this._V=V;
    this._E=0;
    this._adj=Array()
    for (let i=0; i<V; i++){
      this._adj[i]=Array()
    }
  }
  V() {
    return this._V
  }
  E() {
    return this._E
  }
  addEdge(v, w) {
    this._adj[v].push(w)
    this._adj[w].push(v)
  }
  adj(v) {
    return this.adj[v]
  }
  toString() {
    return
  }
}

interface Graph {
  V(): number;// number of vertices
  E(): number;// number of edges
  addEdge(v: number, w: number): void; //add edge v-w to the Graph
  adj(v: number): number[] // vertices adjacent to v, stored in chain
}

```

## 深度优先搜索（DFS）

深度优先搜索在遍历结点时需要坚持两个原则：

- 遍历过的结点标注为已访问
- 递归地访问它没有标注过的邻居结点

可以看出，这种搜索方式是先入先出的，可以利用递归隐形栈结构来实现：

```typescript
class DepthFirstSearch implements DepthFirstSearch {
  private marked: boolean[]
  private edgeTo: number[] //构建树，若v有邻点w,则 edgeTo[w]=v
  private _s:number //搜索的起点
  constructor(G: Graph, s: number) {
    this.marked = Array[G.V()]
    this.dfs(G,s)
  }
  private dfs(G:Graph,v:number):void{
    let adj=G.adj(v)
    let length=adj.length
    for (let i=0; i<length;i++){
      let w=adj[i] //邻点
      if (!this.isMarked(w)){
        this.edgeTo[w]=v
        this.dfs(G,w)
      }
    }
  }
  private isMarked(v:number):boolean{
    return this.marked[v]
  }
  hasPathTo(v:number){
    return this.isMarked(v)
  }
  pathTo(v:number){
    let path=[]
    while(v!==this._s){
      path.push[v]
      v=this.edgeTo[v]
    }
    return path
  }
}

```

回到之前的问题：

> 给定一幅图，两个给定的顶点是否联通

解决方法很简单，当检测s和v是否连通时，从s开始深度遍历，在遍历每一个顶点时，记录下父节点到顶点的路径，push到edgeTo中，这样，edgeTo便是一颗从起点为根节点的树。只要访问得到该顶点（marked[s]===true)，说明从顶点s可以访问到v。我们同时可以通过 edgeTo 得到遍历s到v的路径。

## 广度优先搜索

和深度优先后入先出不同，在广度优先的搜索中，结点的遍历顺序和起点的距离正相关，我们可以采用先入先出的队列进行遍历。广度优先的遍历同样遵从两个规则:

- 取出队列中下一个顶点，标记。
- 将v相邻且未标记的顶点加入队列。

```typescript
class BreadFirstPaths {
  private marked: boolean[]
  private edgeTo: number[] //构建树，若v有邻点w,则 edgeTo[w]=v
  private _s: number //搜索的起点
  constructor(G: Graph, s: number) {
    this.marked = Array[G.V()]
    this.bfs(G, s)
  }
  private bfs(G: Graph, v: number) {
    let queue = [];
    queue.push(v);
    this.marked[v] = true
    while (queue.length) {
      let adj = G.adj(v)
      let length = adj.length
      for (let i = 0; i < length; i++) {
        const w = adj[i]
        if (!this.isMarked(w)) {
          this.marked[w] = true
          this.edgeTo[w] = v
          queue.push(w)
        }
      }
    }
  }
  private isMarked(v: number): boolean {
    return this.marked[v]
  }
  hasPathTo(v: number) {
    return this.isMarked(v)
  }
  pathTo(v: number) {
    let path = []
    while (v !== this._s) {
      path.push[v]
      v = this.edgeTo[v]
    }
    return path
  }
}

```

