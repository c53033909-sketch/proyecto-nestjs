import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Fertilizante Triple 15',
      category: 'Fertilizantes',
      price: 145000,
      stock: 25,
      unit: 'bulto 50kg',
    },
    {
      id: 2,
      name: 'Semilla de Papa Pastusa',
      category: 'Semillas',
      price: 90000,
      stock: 40,
      unit: 'bulto 50kg',
    },
  ];
  private nextId = 3;

  create(createProductDto: CreateProductDto): Product {
    const newProduct: Product = {
      id: this.nextId++,
      ...createProductDto,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product {
    const product = this.products.find((item) => item.id === id);
    if (!product) {
      throw new NotFoundException(`Producto agropecuario #${id} no encontrado`);
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto): Product {
    const product = this.findOne(id);
    Object.assign(product, updateProductDto);
    return product;
  }

  remove(id: number): { deleted: boolean; id: number } {
    const index = this.products.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Producto agropecuario #${id} no encontrado`);
    }
    this.products.splice(index, 1);
    return { deleted: true, id };
  }
}