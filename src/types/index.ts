export class Entity {
    id: string;
    title: string;
    topic: string;
    data: string;
    type: string;
    timestamp: number;
    url: string;

    // constructor (id: string, title: string, topic: string, data: string, type: string, timestamp: number, url: string) {
    //     this.id = id;
    //     this.title = title;
    //     this.topic = topic;
    //     this.data = data;
    //     this.type = type;
    //     this.timestamp = timestamp;
    //     this.url = url;
    // }

    constructor (rawData: any) {
        this.id = rawData.id;
        this.title = rawData.title;
        this.topic = rawData.topic;
        this.data = rawData.data;
        this.type = rawData.type;
        this.timestamp = rawData.timestamp;
        this.url = rawData.url;
    }
}

export interface CreateEntityDto {
    topic_action: string,
    title: string,
    topic: string,
    data: string,
    type: string
    url: string,
    timestamp: number
}