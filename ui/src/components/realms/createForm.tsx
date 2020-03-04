import React, { useState } from 'react';
import {
    Switch,
    Button,
    Intent,
    Toaster,
    FormGroup,
    InputGroup,
    TextArea,
} from "@blueprintjs/core";
import { actions} from "../../store";

const toaster = Toaster.create({
    position: "bottom-left",
    maxToasts: 5
});

function CreateForm() {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState(true);
    const handleSubmit = () => {
        setLoading(true);
        actions.createRealm({
            name,
            enabled,
            description
        }).then(() => {
            toaster.show({
                message: `Realm ${name} created`,
                intent: Intent.SUCCESS,
                icon: 'tick-circle'
            })
            setName('');
            setDescription('');
            setEnabled(true);
        }).catch(async (e) => {
           console.log(e);
           const err = await e;
           toaster.show({
               message: `Coult not create realm ${name}.${err.error ? ` ${err.error}` : ''}`,
               intent: Intent.DANGER
           })
        }).finally(() => setLoading(false));
    }
    return (
        <>
        <FormGroup
            helperText="Typically the URL or name of the service"
            label="Realm"
            labelFor="realm"
            labelInfo="(required)"
        >
            <InputGroup id="realm" placeholder="Realm Name" value={name} onChange={(e: any) => setName(e.target.value)}/>
        </FormGroup>
        <FormGroup
            helperText="A description of the realm"
            label="Description"
            labelFor="description"
        >
            <TextArea id="description" fill={true} value={description} onChange={(e: any) => setDescription(e.target.value)}/>
        </FormGroup>
        <Switch label="Enabled" checked={enabled} onChange={() => setEnabled(!enabled)}/>
        <Button loading={loading} disabled={name === ''} icon="new-object" text="Create Realm" onClick={handleSubmit}/>
        </>
    );
}

export default CreateForm;
