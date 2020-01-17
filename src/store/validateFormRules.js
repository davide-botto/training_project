// Contiene le regole di validazione dei form

export const validateFormRules = {
    namespaced: true,
    state: {
        rules: {
            required: value => !!value || "Campo necessario",
            nameSurname: v => /^[A-Z][a-zì'àè]+$/.test(v) || "Non valido",
            emailFormat: v =>
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
                    v
                ) || "Formato email non valido",

            /**Regole Password:
     * almeno 8 simboli
     * almeno una lettera minuscola
     * almeno una lettera maiuscola
     * almeno un numero
     * almeno un carattere speciale
     */
            passwordFormat: v =>
                /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W)(?=.*[^ ]).*$/.test(
                    v
                ) || "Formato password non valido"

        }
    },
    getters: {
        rules(state) {
            return state.rules;
        }
    }
}