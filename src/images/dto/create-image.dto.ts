import { Resource } from "src/resources/entities/resource.entity";

export class CreateImageDto {
    url: string;
    pathDevice: string;
    resource: Resource;
}
