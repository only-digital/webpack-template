namespace Only {
    export abstract class InputBase extends Component {
        classNames = {
            fill: '_fill',
            active: '_active',
            error: '_error',
            valid: '_valid',
            disabled: '_disabled',
            required: '_required',
        };

        input: HTMLInputElement;

        isValid = true;

        isActive: boolean;

        isInsideTab: boolean;

        protected constructor(element: ComponentProps) {
            super(element);

            this.input = this.nRoot.querySelector('input');
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

        get required(): boolean {
            return this.input.required;
        }

        set disable(value: boolean) {
            this.input.disabled = value;
        }

        get disable(): boolean {
            return this.input.disabled;
        }

        addClass = (className: string): void => {
            this.nRoot.classList.add(className);
        };

        removeClass = (className: string): void => {
            this.nRoot.classList.remove(className);
        };

        clear = (): void => {
            Object.values(this.classNames).forEach((key) => this.removeClass(key));
            this.value = '';
            if (this.input.checked) this.input.checked = false;
        };

        destroy() {
            super.destroy();
        };
    }
}
