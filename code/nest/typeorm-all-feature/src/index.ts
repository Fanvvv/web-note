import { AppDataSource } from "./data-source"
import { User } from "./entity/User"

AppDataSource.initialize().then(async () => {

    // 批量新增和修改
    // await AppDataSource.manager.save(User, [
    //     { id: 1, firstName: "Timber", lastName: "Saw", age: 25 },
    //     { firstName: "fan", lastName: "f", age: 10 },
    // ])

    // 批量删除
    // await AppDataSource.manager.delete(User, 2)
    // const user = new User()
    // user.id = 3
    // await AppDataSource.manager.remove(User, user)

    // 查找
    // findOne 查询一个
    const findOneUser = await AppDataSource.manager.findOne(User, { where: { firstName: 'fan' } })
    console.log("findOneUser: ", findOneUser)
    // findBy 根据条件查询
    const findByUser = await AppDataSource.manager.findBy(User, { firstName: 'fan' })
    console.log("findByUser: ", findByUser)
    // findAndCount 查询并统计
    const [users, count] = await AppDataSource.manager.findAndCount(User, { where: { firstName: 'fan' } })
    console.log("users: ", users, "count: ", count)
    // query sql查询
    const queryUser = await AppDataSource.manager.query("SELECT * FROM user WHERE firstName = ?", ['fan'])
    console.log("queryUser: ", queryUser)
    // 构造器查询
    const findBuilderUser = await AppDataSource.manager.createQueryBuilder(User, "user")
        .where("user.firstName = :firstName", { firstName: 'fan' })
        .getMany()
    console.log("findBuilderUser: ", findBuilderUser)

    /**
     * findOne
     * SELECT `User`.`id` AS `User_id`, `User`.`firstName` AS `User_firstName`, `User`.`lastName` AS `User_lastName`, `User`.`age` AS `User_age` FROM `user` `User` WHERE ((`User`.`firstName` = ?)) LIMIT 1 -- PARAMETERS: ["fan"]
     * findBy
     * SELECT `User`.`id` AS `User_id`, `User`.`firstName` AS `User_firstName`, `User`.`lastName` AS `User_lastName`, `User`.`age` AS `User_age` FROM `user` `User` WHERE ((`User`.`firstName` = ?)) -- PARAMETERS: ["fan"]
     * findAndCount
     * SELECT `User`.`id` AS `User_id`, `User`.`firstName` AS `User_firstName`, `User`.`lastName` AS `User_lastName`, `User`.`age` AS `User_age` FROM `user` `User` WHERE ((`User`.`firstName` = ?)) -- PARAMETERS: ["fan"]
     * SELECT COUNT(1) AS `cnt` FROM `user` `User` WHERE ((`User`.`firstName` = ?)) -- PARAMETERS: ["fan"]
     * query
     * SELECT * FROM user WHERE firstName = ? -- PARAMETERS: ["fan"]
     * createQueryBuilder
     * SELECT `user`.`id` AS `user_id`, `user`.`firstName` AS `user_firstName`, `user`.`lastName` AS `user_lastName`, `user`.`age` AS `user_age` FROM `user` `user` WHERE `user`.`firstName` = ? -- PARAMETERS: ["fan"]
     */

    // 开启事务
    // await AppDataSource.manager.transaction(async manager => {
    //     await manager.save(User, {
    //         id: 4,
    //         firstName: 'eee',
    //         lastName: 'eee',
    //         age: 20
    //     });
    // });

    // getRepository 简化实体传入
    const userRepo = AppDataSource.getRepository(User)
    await userRepo.save({
        id: 5,
        firstName: 'asd',
        lastName: 'asd',
        age: 22
    });

    const allUsers = await AppDataSource.manager.find(User)
    console.log("allUsers: ", allUsers)

}).catch(error => console.log(error))
