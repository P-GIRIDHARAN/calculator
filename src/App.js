import { useReducer } from "react";
import "./styles.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE: "choose",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVAL: "eval",
};
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          curroperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.curroperand === "0") return state;
      if (payload.digit === "." && state.curroperand.includes("."))
        return state;
      return {
        ...state,
        curroperand: `${state.curroperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE:
      if (state.curroperand == "null" && state.prevoperand == "null") {
        return state;
      }
      if (state.curroperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.prevoperand == null) {
        return {
          ...state,
          operation: payload.operation,
          prevoperand: state.curroperand,
          curroperand: null,
        };
      }
      return {
        ...state,
        prevoperand: evaluate(state),
        operation: payload.operation,
        curroperand: null,
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          curroperand: null,
        };
      }
      if (state.curroperand == null) return state;
      if (state.curroperand.length === 1) {
        return { ...state, curroperand: null };
      }
      return {
        ...state,
        curroperand: state.curroperand.slice(0, -1),
      };
    case ACTIONS.EVAL:
      if (
        state.operation == null ||
        state.curroperand == null ||
        state.prevoperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        prevoperand: null,
        operation: null,
        curroperand: evaluate(state),
      };
    case ACTIONS.CLEAR:
      return {};
  }
}
function evaluate({ curroperand, prevoperand, operation }) {
  const prev = parseFloat(prevoperand);
  const curr = parseFloat(curroperand);
  if (isNaN(prev) || isNaN(curr)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "*":
      computation = prev * curr;
      break;
    case "/":
      computation = prev / curr;
      break;
  }
  return computation.toString();
}
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatoperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}
function App() {
  const [{ curroperand, prevoperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <div className="calculator">
      <div className="output">
        <div className="prev-op">
          {formatoperand(prevoperand)} {operation}
        </div>
        <div className="curr-op">{formatoperand(curroperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVAL })}
      >
        =
      </button>
    </div>
  );
}

export default App;
