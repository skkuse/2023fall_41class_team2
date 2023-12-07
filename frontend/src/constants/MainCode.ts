// Copyright (C) 2023 Intel Corporation
// SPDX-License-Identifier: MIT

const MAIN_CODE = `
import java.util.EmptyStackException;
import java.util.Arrays;

class Stack {
    private Object[] elements;
    private int size = 0;
    private static final int DEFAULT_INITIAL_CAPACITY = 1000001;
    public Stack() {
        elements = new Object[DEFAULT_INITIAL_CAPACITY];
    }
    public void push(Object e) {
        ensureCapacity();
        elements[size++] = e;
    }
    public Object pop() {
        if (size == 0) throw new EmptyStackException();
        Object result = elements[--size];
        elements[size] = null; // Eliminate obsolete reference
        return result;
    }
    private void ensureCapacity() {
        if (elements.length == size) elements = Arrays.copyOf(elements, 2 * size + 1);
    }
}

public class After {
    public static void function1() {
        Stack stack = new Stack();

        // Pushing elements onto the stack
        for (int i = 0; i < 1000000; i++) {
            stack.push("Element " + i);
        }

        // Popping elements from the stack

        for (int i = 0; i < 1000000; i++) {
            Object popped = stack.pop();
        }

    }

    public static void main(String[] args) {
        for (long i = 0L; i < 100L; i++) {
            function1();
        }
    }
}`;

export default MAIN_CODE;
