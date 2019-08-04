// 类修饰器
function log(target) {
  const desc = Object.getOwnPropertyDescriptors(target.prototype);
  for (const key of Object.keys(desc)) {
    if (key === "constructor") {
      continue;
    }

    const func = desc[key].value;
    if ("function" === typeof func) {
      Object.defineProperty(target.prototype, key, {
        value(...args) {
          console.log("before " + key);
          const ret = func.apply(this.args);
          console.log("after " + key);

          return ret;
        }
      });
    }
  }
}

// 类成员修饰器
function readonly(target, key, descriptor) {
  descriptor.writable = false;
}

// 类方法修饰器
function validate(target, key, descriptor) {
  console.log("target = ", target);
  console.log("key = ", key);
  console.log("descriptor = ", descriptor);
  const func = descriptor.value;
  console.log("func = ", func);
  descriptor.value = function(...args) {
    console.log("args = ", args);
    for (let num of args) {
      console.log("num type = ", typeof num);
      if ("number" !== typeof num) {
        console.log("11111");
        throw new Error(`${num} is not a number`);
      }
    }
    func.apply(this, args);
  };
}

@log
class Numberic {
  @readonly PI = 3.1415926;

  @validate
  add(...nums) {
    return nums.reduce((p, n) => {
      return p + n;
    }, 0);
  }
}

new Numberic().add(1, "x");
