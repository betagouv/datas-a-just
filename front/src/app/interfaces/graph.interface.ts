export class Box {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number,
        public label: string,
    ) {
    }
}

export interface IPoint {
    x: number;
    y: number;
}

export class Edge {
    constructor(private points: IPoint[]) {
    }
    public get path(): string {
        if (this.points.length < 2) return "";
        var result = "M ";
        this.points.forEach(pt => {
            result += `${pt.x} ${pt.y} L`;
        });
        return result.substr(0, result.length - 2);
    }
}

export class Node {
    constructor(
        public id: string,
        public parentId: string | null,
    ) {
    }
}