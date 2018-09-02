class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }

    static validate_node(datum) {
        return datum instanceof Node
    }

    is_empty() {
        return this.data === undefined
    }
}

class LinkedList {
    constructor(head) {
        let node = LinkedList.create_node(head);
        if (node === undefined) {
            this.head = null;
            this.length = 0;
        }
        else {
            this.head = node;
            this.length = 1;
        }
    }

    static create_node(datum) {
        let node = datum;
        if (!Node.validate_node(node)){
            node = new Node(node)
        }
        return node
    }

    is_empty() {
        return this.length <= 0 || this.head === null || this.head.is_empty();
    }

    // add new elements to the list
    push(data) {
        let node = LinkedList.create_node(data);
        node.next = this.head;
        this.head = node;
        this.length += 1;
    }

    pop() {
        if (this.is_empty()) {
            return null;
        }
        else {
            let temp = this.head;
            this.head = this.head.next;
            this.length -= 1;
            return temp.data;
        }
    }

    get first() {
        return this.is_empty() ? null : this.head.data
    }
}


module.exports = {
    'Node': Node,
    'LinkedList': LinkedList
};
