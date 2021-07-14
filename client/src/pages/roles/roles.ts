import {Options, Vue} from 'vue-class-component'
import {useStore} from "@/store";

@Options({})
export default class Roles extends Vue {
    private store = useStore();
    private current_user = this.store.getters.getCurrentUser;
    private user_permissions = [
        'can_create_expense',
        'can_update_expense',
        'can_delete_expense',
        'can_change_password'
    ]

    public modal_shown = false;
    public is_saving = false;
    public add_mode = true;
    public datasets = [];
    public form_data = {
        id: -1,
        name: "",
        description: "",
        permissions: [] as any
    };
    public permissions = [];
    public alert = {
        show:false,
        type:"alert-danger",
        icon:"fa-ban",
        title:"",
        message:""
    }

    get modal_title(): string {
        return this.add_mode ? "Add Role" : "Update Role"
    }

    get save_button_title(): string {
        return this.add_mode ? "Save" : "Update"
    }

    get has_datasets(): boolean {
        return this.datasets.length !== 0;
    }

    get can_delete() {
        if (this.form_data.name === "Administrator")
            return false;
        return !this.add_mode && this.form_data.id !== -1;
    }

    get can_save() {
        return this.form_data.name !== "Administrator";
    }

    get permissionCheckList() {
        if(this.hasRole("Administrator") && this.form_data.name === "Administrator")
            return this.permissions;
        else
            return this.permissions.reduce((a,c:any)=>{
                if(this.user_permissions.includes(c.name))
                    a.push(c)
                return a;
            },[] as any);
    }

    public hasRole(name: string) {
        return this.current_user.roles.includes(name);
    }

    public hasPermission(name: string) {
        return this.current_user.permissions.includes(name);
    }

    public async mounted(): Promise<void> {
        this.resetForm();
        await this.getAll();
        await this.getAllPermission();
    }

    public async getAll(): Promise<void> {
        const response = await this.axios.get('/api/roles/');
        this.datasets = response.data;
    }

    public async getAllPermission(): Promise<void> {
        const response = await this.axios.get('/api/roles/permissions');
        this.permissions = response.data;
    }

    public async get(id: number): Promise<any> {
        const response = await this.axios.get('/api/roles/' + id);
        return response.data;
    }


    public toggleModal(add_mode: boolean): void {
        this.add_mode = add_mode;
        if (this.add_mode)
            this.resetForm();
        this.modal_shown = !this.modal_shown;
    }

    public async save() {
        this.is_saving = true;
        const response = await this.axios.post('/api/roles/save', this.form_data);
        this.modal_shown = false;
        this.is_saving = false;

        this.alert = {
            show:true,
            type:"alert-success",
            icon:"fa-check-circle",
            title:"Success!",
            message:"Role "+response.data.name + ", successfully saved."
        }

        await this.getAll();

    }

    public async edit(item: any) {
        this.form_data = await this.get(item.id);
        this.toggleModal(false);
    }

    public resetForm() {
        this.form_data = {
            id: -1,
            name: "",
            description: "",
            permissions: [] as any
        };
        for(const item of this.permissionCheckList){
            this.togglePermission(item);
        }
    }

    public permissionExist(id: number) {
        const p = this.form_data.permissions.find((a: { [x: string]: number; }) => a['id'] === id)
        return p !== undefined
    }

    public togglePermission(item: any) {
        if (this.permissionExist(item.id)) {
            const index = this.form_data.permissions.findIndex((a: { [x: string]: any; }) => a['id'] === item.id);
            this.form_data.permissions.splice(index, 1);
        } else {
            this.form_data.permissions.push(item)
        }
    }

    public async deleteRecord(id:number){
        try{
            this.is_saving = true;
            const response = await this.axios.delete('/api/roles/' + id);
            if(response.status === 204){
                this.alert = {
                    show:true,
                    type:"alert-warning",
                    icon:"fa-exclamation-triangle",
                    title:"Alert!",
                    message:"A record was deleted."
                }
            }
            this.modal_shown = false;
            this.is_saving = false;
            await this.getAll();
        }catch (e){
            this.alert = {
                show:true,
                type:"alert-danger",
                icon:"fa-ban",
                title:"Error!",
                message:e.message
            }
        }
    }
}
