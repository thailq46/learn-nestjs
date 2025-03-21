# Decorators

- Decorators là để gắn thêm metadata vào các thành phần của ứng dụng giúp NestJS có thể đọc và xử lý thông tin một cách tự động tại thời điểm chạy (runtime), từ đó quản lý các thành phần của ứng dụng một cách hiệu quả, chẳng hạn như dependency injection, routing, validation, và nhiều thứ khác.
- `Decorator bắt đầu bằng dấu @, sau đấy là 'expression'`
  @Controller()
  @Injectable()
  -> expression nói cho compiler biết là cái decorator này nó có nghĩa là gì
- `Gồm 5 loại decorators`
  - Class declaration itself
  - Properties
  - Accessors (getter/setter)
  - Methods
  - Parameters
- `Tại sao cần Decorator?`
  Giúp viết code ngắn hơn, có khả năng tái sử dụng ở nhiều nơi
- `2 cách viết Decorators`

  ```ts
  class ExampleClass {
    @decorate1()
    @decorate2
    method() {
      return 'something';
    }
  }
  ```

# Inversion Of Control (IoC)

- IoC là khái niệm (principle), ko phải cách làm. Nó là cách "đảo ngược" sự kiểm soát, nhờ có IoC trong OOP ta có thể giảm thiểu sự phụ thuộc giữa các class với nhau
  => Mục đích có thể tách rời và test độc lập, không phụ thuộc vào nhau
- Sử dụng các pattern như Factory, Dependencies Injections,...

```ts
class TeamCarVF8 {
  produceCar() {
    console.log('Start Car: --> VF8');
  }
}
class TeamCarVF9 {
  produceCar() {
    console.log('Start Car: --> VF9');
  }
}
class TeamLead {
  // private teamCarVF8: TeamCarVF8 = new TeamCarVF8();
  private teamCarVF9: TeamCarVF9 = new TeamCarVF9();
  task() {
    // this.teamCarVF8.produceCar();
    this.teamCarVF9.produceCar();
  }
}
class TeamCompany {
  start() {
    const teamLead = new TeamLead();
    teamLead.task();
  }
}
const teamCompany = new TeamCompany();
teamCompany.start();
/*
  Code trên rất ổn định cho đến khi có 1 chu trình mới được sinh ra. VD sau 1 năm thì model VF9 đc sinh ra -> Nó giao nhiệm vụ cho teamLead -> teamLead phải phụ thuộc vào teamVF9 hay vì teamVF8 -> Bắt đầu phải mở code ra và sửa đổi ngay chính trong code logic của nó -> Vi phạm nguyên tắc SOLID 
  -> Lúc này có 3 model phụ thuộc vào nhau. TeamCompany phụ thuộc vào TeamLead -> TeamLead phụ thuộc vào TeamCar -> Cấp cao lại đi phụ thuộc vào cấp thấp -> Vi phạm sự đảo ngược phụ thuộc -> Các model cấp cao ko lên phụ thuộc gì vào các model cấp thấp
*/
interface TeamProduce {
  makeCar: () => void;
}
class TeamCarVF8 implements TeamProduce {
  produceCar() {
    console.log('Start Car: --> VF8');
  }
  makeCar() {
    this.produceCar();
  }
}
class TeamCarVF9 implements TeamProduce {
  produceCar() {
    console.log('Start Car: --> VF9');
  }
  makeCar() {
    this.produceCar();
  }
}
class TeamLead {
  private teamProduce: TeamProduce = new TeamCarVF9();
  task() {
    this.teamProduce.produceCar();
  }
}
class TeamCompany {
  start() {
    const teamLead = new TeamLead();
    teamLead.task();
  }
}
const teamCompany = new TeamCompany();
teamCompany.start();
/*
  Ở đây nó đã giảm 1 chút sự phụ thuộc vào teamCarVF8 và teamCarVF9 -> Sau khi thêm interface thì trong tương lai muốn thêm model xe mới chỉ cần implements TeamProduce -> teamLead ko còn phụ thuộc vào teamCar nhiều nữa
  => Vẫn có 1 nhược điểm là vẫn phải sửa code ở teamLead -> nguyên tắc IoC chưa áp dụng hết toàn bộ -> IoC chỉ cho ta biết những gì đang xảy ra và thiếu xót ở đây là gì và ko cho ta biết là lên làm gì để hay nhất có thể
  => Ta sẽ sử dụng DI (Dependency Injection): tiêm sự phụ thuộc -> Giúp giải quyết vấn đề IoC
*/
interface TeamProduce {
  makeCar: () => void;
}
class TeamCarVF8 implements TeamProduce {
  produceCar() {
    console.log('Start Car: --> VF8');
  }
  makeCar() {
    this.produceCar();
  }
}
class TeamCarVF9 implements TeamProduce {
  produceCar() {
    console.log('Start Car: --> VF9');
  }
  makeCar() {
    this.produceCar();
  }
}
class TeamLead {
  private teamProduce: TeamProduce;
  constructor(teamProduce: TeamProduce) {
    this.teamProduce = teamProduce;
  }
  task() {
    this.teamProduce.makeCar();
  }
}
class TeamCompany {
  start() {
    const produce: TeamCarVF9 = new TeamCarVF9();
    const teamLead = new TeamLead(produce);
    teamLead.task();
  }
}
const teamCompany = new TeamCompany();
teamCompany.start();
// Lúc này model cao nhất là TeamCompany sẽ có quyền chỉ định
```

# Dependency Injection (DI)

- DI là kỹ thuật cho phép ta "tiêm" (inject) các dependency vào bên trong một lớp thay vì để lớp đó tự khởi tạo chúng

  - NestJS tự động quản lý dependency thông qua IoC
  - DI giúp:
    - Giảm sự phụ thuộc giữa các class
    - Dễ dàng mở rộng và test code

- `Có 3 level của DI`

  - Constructor Injection
  - Property Injection
  - Method Injection
    => Với NestJS, tập trung sử dụng Constructor Injection

- `Cách thức hoạt động của DI`
  `DI Container`: để quản lý tất cả các provider. Container này sẽ tự động khởi tạo các instance của các lớp được đánh dấu bằng decorator @Injectable() và cung cấp chúng cho các lớp khác khi cần.
  `Constructor Injection`: dependency được khai báo thông qua constructor của lớp
  `Module Registration`: Để DI hoạt động, các provider cần được đăng ký trong một module thông qua thuộc tính providers. Sau đó, các controller hoặc service khác có thể yêu cầu chúng thông qua constructor.

# Service

- Service là nơi xử lý nghiệp vụ của ứng dụng
- Mục tiêu: Tách biệt logic xử lý khỏi Controller, giúp code sạch hơn và dễ bảo trì
- Service thường được `inject` vào Controller thông qua `DI`

- `Tạo service bằng CLI` -> nest generate service user

- Làm thế nào để đưa Service vào Responsitory cho DI Container quản lý:
  B1: Đánh dấu Decorator cho Service
  B2: Đưa Service và Controller vào Providers cho module
  B3: Trong Controller dùng constructor để Inject Service

# Scope của Provider trong DI

- NestJS có 3 scope chính cho Provider:

  - Singleton (Mặc định): Service chỉ được khởi tạo `1 lần duy nhất` trong vòng đời của ứng dụng

  ```ts
  @Injectable()
  export class AppService {}
  ```

  - Request Scope: Service được tạo mới mỗi khi có `request` mới

  ```ts
  @Injectable({scope: Scope.REQUEST})
  export class AppService {}
  ```

  - Transient Scope: Service được tạo mới mỗi khi nó được `inject` vào một class khác

  ```ts
  @Injectable({scope: Scope.TRANSIENT})
  export class AppService {}
  ```

# Xác thực sử dụng passport

- `passport` là thư viện gốc => giúp tạo ra middleware (can thiệp vào req và res), và lưu trữ thông tin người dùng đăng nhập (req.user)
- `nestjs/passport` là thư viện giúp viết theo phong cách NestJS, giúp can thiệp vào passport dễ dàng hơn
- `passport-local` đây là strategy hỗ trợ việc đăng nhập sử dụng username/password

# Guards

- Làm nhiệm vụ giống middleware, can thiệp vào req và res. Req -> Guards -> Res
- Với middleware, không thể biết `handler` phía sau là gì, vì lúc nào cũng làm việc với req, res và phần còn lại là hàm `next()` đã lo
- Còn `guards` thì hoàn toàn ngược lại, nó mạnh mẽ hơn nhờ middleware ngoài khả năng truy cập req, res nó còn được sử dụng `ExcutionContext` (không gian thực thi code)

# Interceptors

- Nó sẽ can thiệp được vào `context(ExecutionContext)` mà thằng middleware nó không bao giờ làm được

# Reactive Programing

# Observable > < Promise

flowchart TD
A[Client gửi Request] --> B[NestJS nhận Request]
B --> C[Interceptor: Pre-processing (log "Trước khi gọi handler")]
C --> D[Handler được gọi]
D --> E[Handler xử lý và trả về kết quả]
E --> F[Interceptor: Post-processing (pipe, tap operator log kết quả)]
F --> G[Response gửi về Client]

Request -> Interceptor -> Pipe (Validate) -> Response

# NestJS Lifecycle Event? Tại sao cần lifecycle

- Với NestJS gồm 3 phases chính:

  - Phase 1: Initializing (Khởi tạo), khởi tạo các connections, DI, modules,...
  - Phase 2: Running -> Chính là lúc ứng dụng chạy thành công
  - Phase 3: Terminating -> Trong quá trình chạy, nếu có bugs xảy ra khiến server bị lỗi => DIE

- Tại sao cần -> Để can thiệp vào quá trình chạy ứng dụng
  - Khi ứng dụng die => Do something
  - Khi ứng dụng chưa chạy lên => Check logic, init fake data,...

# Tạo docs bằng @compodoc/compodoc

npx @compodoc/compodoc -p tsconfig.json -s
