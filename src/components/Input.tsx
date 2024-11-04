import { InputHTMLAttributes, useRef } from "react";

type InputProps = {
    label: string;
    placeholder?: string;
    type?: string;
}

export default function Input(props : InputProps & InputHTMLAttributes<HTMLInputElement>) {
    const inputRef = useRef<HTMLInputElement>(null);

    const focusInput = () => {
        if(!inputRef.current) return;
        inputRef.current.focus();
    }

    return (
        <div className="input-box">
            <label onClick={focusInput} htmlFor={props.id}>{props.label}</label>
            <input
                ref={inputRef}
                id={props.id}
                type={props.type}
                placeholder={props.placeholder}
                {...props}
            />
        </div>
    );
}