import { StateEffect, StateField } from '@codemirror/next/state';
import type { EditorView } from '@codemirror/next/view';

export function defineEffectField<T>(initialValue: T) {
    const effectType = StateEffect.define<T>();
    const field = StateField.define({
        create: () => initialValue,

        update(value, { effects }) {
            const effect = effects.find(e => e.type === effectType) as StateEffect<T>|undefined;
            return effect ? effect.value : value;
        }
    });

    const dispatchEffect = (view: EditorView, value: T) => view.dispatch(view.state.update({
        effects: [effectType.of(value)]
    }));

    return [field, dispatchEffect] as const;
}