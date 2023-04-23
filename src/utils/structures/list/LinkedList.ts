export type LinkedListValue = string | number;

export class LinkedListNode {
  next: Nullable<LinkedListNode> = null;
  prev: Nullable<LinkedListNode> = null;
  value: Nullable<LinkedListValue> = null;

  constructor(value: LinkedListValue) {
    this.value = value;
  }

  displayLink() {
    console.log('Value: ' + this.value + '\n');
  }
}

export class LinkedList {
  first: Nullable<LinkedListNode> = null;
  last: Nullable<LinkedListNode> = null;

  isEmpty() {
    return this.first === null;
  }

  insertFirst(value: LinkedListValue) {
    const newFirst = new LinkedListNode(value);
    newFirst.next = this.first;
    this.first = newFirst;
    if (this.last === null) {
      this.last = newFirst;
    }
  }

  insertLast(value: LinkedListValue) {
    const newLast = new LinkedListNode(value);
    newLast.prev = this.last;
    if (this.last) {
      this.last.next = newLast;
    }
    this.last = newLast;
    if (this.first === null) {
      this.first = newLast;
    }
  }

  insertAfter(link: string, value: LinkedListValue) {
    const newLink = new LinkedListNode(value);
    const element = this.find(link);
    if (element !== -1) {
      const next = element.next;
      if (next) {
        next.prev = newLink;
        newLink.next = next;
      }
      element.next = newLink;
      newLink.prev = element;
    }
  }

  deleteFirst() {
    if (this.first == null) {
      throw new Error('List is empty')
    }
    const deletedItem = this.first;
    const newFirst = this.first.next;
    if (newFirst) {
      newFirst.prev = null;
      this.first = newFirst;
    } else {
      this.first = null;
      this.last = null;
    }
    return deletedItem;
  }

  deleteLast() {
    if (this.last !== null) {
      if (this.last.prev) {
        this.last = this.last.prev;
        this.last.next = null;
      } else {
        this.last = null;
      }
    }
  }

  displayList() {
    let current = this.first;
    while (current) {
      current.displayLink();
      current = current.next;
    }
  }

  find(arg: LinkedListValue | LinkedListNode): LinkedListNode | -1 {
    if (arg instanceof LinkedListNode) {
      let current = this.first;
      while (current) {
        if (arg === current) {
          return current;
        }
        current = current.next;
      }
    } else {
      let current = this.first;
      if (current) {
        while (current?.value !== arg) {
          current = current?.next;
          if (!current) {
            return -1;
          }
        }
        return current;
      }
    }
    return -1;
  }

  delete(link: LinkedListNode) {
    const next = link.next;
    const prev = link.prev;
    if (prev && next) {
      next.prev = prev;
      prev.next = next;
    } else if (next) {
      next.prev = null;
    } else if (prev) {
      prev.next = null;
    }
  }
}
