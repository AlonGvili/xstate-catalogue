import { useService } from "@xstate/react";
import React, { useContext } from "react";
import { Interpreter } from "xstate";

export const MachineHelpersContext = React.createContext<{
  service: Interpreter<any, any, any>;
}>({} as any);

export const State = (props: { children: string }) => {
  const context = useContext(MachineHelpersContext);
  const [state] = useService(context.service);
  return (
    <span
      className={`font-mono font-bold text-sm px-2 py-1 transition-colors ${
        state.matches(props.children)
          ? `bg-green-100 text-green-800`
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {props.children}
    </span>
  );
};

export const Event = (props: { children: string }) => {
  const context = useContext(MachineHelpersContext);
  const [state, send] = useService(context.service);

  const { children, ...event } = props;

  return (
    <button
      onClick={() => {
        send({
          ...event,
          type: props.children,
        });
      }}
      // To override prose
      style={{ margin: 0 }}
    >
      <span
        className={`bg-gray-100 text-gray-600 font-mono font-bold text-sm px-2 py-1 transition-colors ${
          state.nextEvents.includes(props.children)
            ? `bg-yellow-100 text-yellow-800`
            : ""
        }`}
      >
        {props.children}
      </span>
    </button>
  );
};

export const Action = (props: { children: string }) => {
  return (
    <span
      className={`bg-gray-100 text-gray-600 font-mono font-bold text-sm px-2 py-1 transition-colors`}
    >
      {props.children}
    </span>
  );
};

export const Context = (props: { children: string; stringify?: boolean }) => {
  const context = useContext(MachineHelpersContext);
  const [state] = useService(context.service);

  let transform = (entry: string) => entry;

  if (props.stringify) {
    transform = (entry) => JSON.stringify(entry, null, 2);
  }
  return (
    <span
      className={`bg-gray-100 text-gray-600 font-mono font-bold text-sm px-2 py-1 transition-colors ${
        state.context[props.children] ? `bg-yellow-100 text-yellow-800` : ""
      }`}
    >
      {props.children}:{" "}
      {transform(state.context[props.children] ?? "undefined")}
    </span>
  );
};

export const WholeContext = () => {
  const context = useContext(MachineHelpersContext);
  const [state] = useService(context.service);
  return <pre>{JSON.stringify(state.context, null, 2)}</pre>;
};

export const Service = (props: { children: string }) => {
  return (
    <span
      className={`bg-gray-100 text-gray-600 font-mono font-bold text-sm px-2 py-1 transition-colors`}
    >
      {props.children}
    </span>
  );
};
