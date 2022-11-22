import { IsNumber } from 'class-validator';
import { AbstractEntity } from '../entities';

export class AbstractDto {
  @IsNumber()
  id:number;
  constructor(abstract: AbstractEntity) {
    this.id = abstract.id;
  }
}
