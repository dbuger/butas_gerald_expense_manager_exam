import {Options, Vue} from 'vue-class-component'
import {useStore} from "@/store";

@Options({})
export default class User extends Vue {
    private resource = "/api/user/";
    private store = useStore();
    private current_user = this.store.getters.getCurrentUser;
    public alert = {
        show: false,
        type: "alert-danger",
        icon: "fa-ban",
        title: "",
        message: ""
    }
    public modal_shown = false;
    public is_saving = false;
    public add_mode = true;
    public datasets = [];

    public form_data = {
        id: -1,
        name: "",
        email: "",
        password: "",
        confirm_password: "",
        roles: [] as any
    };
    public current_role:string|number = "";

    public roles = [];


    get modal_title(): string {
        return this.add_mode ? "Add User" : "Update User"
    }

    get save_button_title(): string {
        return this.add_mode ? "Save" : "Update"
    }

    get has_datasets(): boolean {
        return this.datasets.length !== 0;
    }

    get can_delete() {
        if (this.current_role === 1)
            return false;
        return !this.add_mode && this.form_data.id !== -1;
    }

    get can_save() {
        return this.current_role !== 1;
    }

    get form_data_role_name(){
        return this.form_data.roles.length !== 0 ? this.form_data.roles[0].name : ""
    }

    get rolesSelection(){
        return this.roles.reduce((a,c:any)=>{
            if(c.id !== 1)
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
        await this.getAllRoles();
    }

    public async getAll(): Promise<void> {
        const response = await this.axios.get(this.resource);
        this.datasets = response.data;
    }

    public async getAllRoles(): Promise<void> {
        const response = await this.axios.get('/api/roles/');
        this.roles = response.data;
    }

    public async get(id: number): Promise<any> {
        const response = await this.axios.get(this.resource + id);
        return response.data;
    }

    public resetForm() {
        this.form_data = {
            id: -1,
            name: "",
            email: "",
            password: "",
            confirm_password: "",
            roles: [] as any
        };
        this.current_role = "";
    }

    public toggleModal(add_mode: boolean): void {
        this.add_mode = add_mode;
        if (this.add_mode)
            this.resetForm();
        this.modal_shown = !this.modal_shown;
    }

    public async save() {
        try {
            this.is_saving = true;
            this.form_data.roles = [this.current_role]
            const response = await this.axios.post(`${this.resource}save`, this.form_data);

            this.alert = {
                show: true,
                type: "alert-success",
                icon: "fa-check-circle",
                title: "Success!",
                message: "User " + response.data.name + ", successfully saved."
            }

            await this.getAll();
        } catch (e) {
            this.alert = {
                show: true,
                type: "alert-danger",
                icon: "fa-ban",
                title: "Error!",
                message: e.message + ": "+ e.response.data
            }
        } finally {
            this.modal_shown = false;
            this.is_saving = false;
        }

    }

    public async edit(item: any) {
        this.form_data = await this.get(item.id);
        this.current_role = this.form_data.roles[0].id
        this.toggleModal(false);
    }

    public async deleteRecord(id: number) {
        try {
            this.is_saving = true;
            const response = await this.axios.delete(this.resource + id);
            if (response.status === 204) {
                this.alert = {
                    show: true,
                    type: "alert-warning",
                    icon: "fa-exclamation-triangle",
                    title: "Alert!",
                    message: "A record was deleted."
                }
            }
            this.modal_shown = false;
            this.is_saving = false;
            await this.getAll();
        } catch (e) {
            this.alert = {
                show: true,
                type: "alert-danger",
                icon: "fa-ban",
                title: "Error!",
                message: e.message
            }
        }
    }
}
