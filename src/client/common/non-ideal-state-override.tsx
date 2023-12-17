import {
    AbstractPureComponent,
    Classes,
    Icon,
    Intent,
    NonIdealState,
    NonIdealStateIconSize,
    NonIdealStateProps
} from "@blueprintjs/core";

import classNames from "classnames";

export interface IdealStateProps extends NonIdealStateProps {
    /**
     * The intent of the component. If left undefined, the icon will use a muted style.
     */
    iconIntent?: Intent;
}

/**
 * A variaint of NonIdealState which supports setting the icon intent.
 */
export class NonIdealStateOverride extends AbstractPureComponent<IdealStateProps> {
    private nonIdealState: NonIdealState;

    public constructor(props: IdealStateProps) {
        super(props);
        this.nonIdealState = new NonIdealState(props);
        this.nonIdealState["maybeRenderVisual"] =
            this.maybeRenderVisualOverride;
    }

    public static defaultProps: Partial<IdealStateProps> = {
        iconSize: NonIdealStateIconSize.STANDARD,
        layout: "vertical"
    };

    public render() {
        return this.nonIdealState.render();
    }

    private maybeRenderVisualOverride() {
        const { icon, iconIntent, iconSize } = this.props;
        if (icon == null) {
            return undefined;
        }
        return (
            <div
                className={classNames(
                    !iconIntent && Classes.NON_IDEAL_STATE_VISUAL
                )}
                style={{
                    fontSize: `${iconSize}px`,
                    lineHeight: `${iconSize}px`
                }}
            >
                <Icon
                    icon={icon}
                    intent={iconIntent}
                    size={iconSize}
                    aria-hidden={true}
                    tabIndex={-1}
                />
            </div>
        );
    }
}
