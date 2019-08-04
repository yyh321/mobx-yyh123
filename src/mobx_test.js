import { observable, computed, when } from "mobx";

// mobx 对array,map,object使用observable操作,对除这3种以外的使用observable.box操作

class Store {
  @observable array = [];
  @observable obj = {};
  @observable map = new Map();

  @observable string = "hello";
  @observable number = 20;
  @observable bool = true;
}

var store = new Store();

var foo = computed(function() {
  return store.string + "/" + store.number;
});

foo.observe(function(change) {
  console.log(change);
});

store.string = "world";
console.log(foo.get());

when(() => store.bool, () => console.log("it is true"));
