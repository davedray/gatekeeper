import React, {useEffect, useState} from 'react';
import {
    Switch,
    Button,
    FormGroup,
    InputGroup,
    TextArea,
} from "@blueprintjs/core";
import {Realm} from "../../../types";

interface props {
    onSave: (realm: Omit<Realm, "id">) => Promise<any>;
    isSaving: boolean;
    error: string|null;
}
function CreateForm({onSave, isSaving, error}: props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [enabled, setEnabled] = useState(true);
    const handleSubmit = async () => {
        await onSave({
            name,
            enabled,
            description
        });
    };
    useEffect(() => {
        if (!isSaving && !error) {
            setName('');
            setDescription('');
            setEnabled(true);
        }
    }, [isSaving, error]);
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
        <Button loading={isSaving} disabled={name === ''} icon="new-object" text="Create Realm" onClick={handleSubmit}/>
        </>
    );
}

export default CreateForm;
