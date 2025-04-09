import { Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { City } from './entities/city.entity';

@Injectable()
export class CityService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  @InjectRepository(City)
  private cityRepository: Repository<City>;

  create(createCityDto: CreateCityDto) {
    return this.cityRepository.save(createCityDto);
  }

  findAll() {
    return this.cityRepository.find();
  }

  // 树形结构返回
  findTree() {
    return this.entityManager.getTreeRepository(City).findTrees();
  }

  // 获取所有根节点
  findRoots() {
    return this.entityManager.getTreeRepository(City).findRoots();
  }

  // 获取某个节点的所有后代节点
  async findDescendantsTree(id: number) {
    const parent = await this.cityRepository.findOne({ where: { id } });
    return parent
      ? this.entityManager.getTreeRepository(City).findDescendantsTree(parent)
      : {};
  }

  // 获取某个节点的所有祖先节点
  async findAncestorsTree(id: number) {
    const child = await this.cityRepository.findOne({ where: { id } });
    return child
      ? this.entityManager.getTreeRepository(City).findAncestorsTree(child)
      : {};
  }

  findOne(id: number) {
    return this.cityRepository.findOne({ where: { id } });
  }

  update(id: number, updateCityDto: UpdateCityDto) {
    return this.cityRepository.update(id, updateCityDto);
  }

  remove(id: number) {
    return this.cityRepository.delete(id);
  }
}
