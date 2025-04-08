import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import { IdCard } from "./entity/IdCard"
import {Department} from "./entity/Department";
import {Employee} from "./entity/Employee";
import {Article} from "./entity/Article";
import {Tag} from "./entity/Tag";

AppDataSource.initialize().then(async () => {

    // 一对一
    // const user = new User()
    // user.firstName = "Timber"
    // user.lastName = "Saw"
    // user.age = 25
    //
    // const idCard = new IdCard()
    // idCard.cardName = '身份证11111'
    // idCard.user = user

    // 设置了级联操作，就可以只保存 idCard，会自动保存 user
    // await AppDataSource.manager.save(user)
    // await AppDataSource.manager.save(idCard)

    // const IdCards = await AppDataSource.manager.find(IdCard, {
    //     relations: {
    //         user: true
    //     }
    // })
    // console.log("IdCards: ", IdCards)
    // const user = await AppDataSource.manager.find(User, {
    //     relations: {
    //         idCard: true
    //     }
    // })
    // console.log("user: ", user)

    // 一对多
    // const department = new Department()
    // const employee1 = new Employee()
    // employee1.name = 'employee1'
    // const employee2 = new Employee()
    // employee2.name = 'employee2'
    //
    // department.name = 'department1'
    // department.employees = [employee1, employee2]
    // await AppDataSource.manager.save(Department, department)
    //
    // const departments = await AppDataSource.manager.find(Department, {
    //     relations: {
    //         employees: true
    //     }
    // })
    // console.log("departments: ", departments)

    // 多对多
    const article = new Article()
    article.title = 'article1'
    article.content = 'article1 content'
    const tag1 = new Tag()
    tag1.name = 'tag1'
    const tag2 = new Tag()
    tag2.name = 'tag2'
    article.tag = [tag1, tag2]
    await AppDataSource.manager.save(Article, article)

    const articles = await AppDataSource.manager.find(Article, {
        relations: {
            tag: true
        }
    })
    console.log("articles: ", articles)
}).catch(error => console.log(error))
