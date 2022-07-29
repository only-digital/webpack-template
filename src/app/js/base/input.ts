import Component, {ComponentProps} from "@/base/component";

abstract class BaseInput extends Component {
    public classNames = {
        fill: '_fill',
        active: '_active',
        error: '_error',
        valid: '_valid',
        disabled: '_disabled',
        required: '_required',
    };

    public input: HTMLInputElement;

    public isValid: boolean;

    public isActive: boolean;

    protected constructor(element: ComponentProps) {
        super(element);

        this.isValid = true;
        this.isActive = false;
        this.input = this.nRoot.querySelector('input')!;
    }

    get name(): string {
        return this.input.name;
    }

    get value(): string {
        return this.input.value;
    }

    set value(value: string) {
        this.input.value = value;
    }

    get type(): string {
        return this.input.type;
    }

    get checked(): boolean {
        return this.input.checked;
    }

    set checked(value: boolean) {
        this.input.checked = value;
    }

    get required(): boolean {
        return this.input.required;
    }

    set disable(value: boolean) {
        this.input.disabled = value;
    }

    get disable(): boolean {
        return this.input.disabled;
    }

    public clear = (): void => {
        this.nRoot.classList.remove(...Object.values(this.classNames));
        this.value = '';
        this.checked = false;
    };
}

export default BaseInput;
