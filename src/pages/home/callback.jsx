import React, { useState, useCallback } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from '../../slice/counterSlice';

const Counter = () => {
const count = useSelector((state)=>state.counter.value)
const dispatch = useDispatch();

return(
    <div>
    <p>Count: {count}</p>
    <button onClick={() => dispatch(increment())}>Increment</button>
    <button onClick={() => dispatch(decrement())}>Decrement</button>
    <button onClick={() => dispatch(incrementByAmount(5))}>Increment by 5</button>
  </div>
)

};

export default Counter;
