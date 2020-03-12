import React, {useEffect, useState} from 'react';
import {
    Button,
    FormGroup,
    InputGroup,
    TextArea,
} from "@blueprintjs/core";
import {NewRole, Realm} from "../../../types";

interface props {
    onSave: (role: Omit<NewRole, "realmId">) => Promise<any>;
    isSaving: boolean;
    error: string|null;
    realm: Realm|null;
}
function CreateForm({onSave, isSaving, error, realm}: props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const handleSubmit = async () => {
        await onSave({
            name,
            description
        });
    };
    useEffect(() => {
        if (!isSaving && !error) {
            setName('');
            setDescription('');
        }
    }, [isSaving, error]);
    if (!realm) return null;
    return (
        <>
            <FormGroup
                helperText="The name of the role"
                label="Role"
                labelFor="role"
                labelInfo="(required)"
            >
                <InputGroup id="role" placeholder="Role Name" value={name} onChange={(e: any) => setName(e.target.value)}/>
            </FormGroup>
            <FormGroup
                helperText="A description of the role"
                label="Description"
                labelFor="description"
            >
                <TextArea id="description" fill={true} value={description} onChange={(e: any) => setDescription(e.target.value)}/>
            </FormGroup>
            <Button loading={isSaving} disabled={name === ''} icon="people" text="Create Role" onClick={handleSubmit}/>
        </>
    );
}

export default CreateForm;
