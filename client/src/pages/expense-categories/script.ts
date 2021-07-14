import {Options, Vue} from 'vue-class-component'
import {useStore} from "@/store";

@Options({})
export default class ExpenseCategories extends Vue {

    private resource = "/api/expense_categories/";
    private store = useStore();
    private current_user = this.store.getters.getCurrentUser;

    public modal_shown = false;
    public is_saving = false;
    public add_mode = true;
    public datasets = [];
    public form_data = {
        id: -1,
        name: "",
        description: "",
        hex_color: "#ffffff"
    };
    public alert = {
        show:false,
        type:"alert-danger",
        icon:"fa-ban",
        title:"",
        message:""
    }



    get modal_title(): string {
        return this.add_mode ? "Add Category" : "Update Category"
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

    public hasRole(name: string) {
        return this.current_user.roles.includes(name);
    }

    public hasPermission(name: string) {
        return this.current_user.permissions.includes(name);
    }

    public async mounted(): Promise<void> {
        this.resetForm();
        await this.getAll();
    }

    public async getAll(): Promise<void> {
        const response = await this.axios.get(this.resource);
        this.datasets = response.data;
    }


    public async get(id: number): Promise<any> {
        const response = await this.axios.get(this.resource + id);
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
        const response = await this.axios.post(`${this.resource}save`, this.form_data);
        this.modal_shown = false;
        this.is_saving = false;

        this.alert = {
            show:true,
            type:"alert-success",
            icon:"fa-check-circle",
            title:"Success!",
            message:"Category: "+response.data.name + ", successfully saved."
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
            hex_color: "#ffffff"
        };

    }

    public async deleteRecord(id:number){
        try{
            this.is_saving = true;
            const response = await this.axios.delete(this.resource + id);
            if(response.status === 204){
                this.alert = {
                    show:true,
                    type:"alert-warning",
                    icon:"fa-exclamation-triangle",
                    title:"Alert!",
                    message:"A record was deleted."
                }
            }
            await this.getAll();
        }catch (e){
            this.alert = {
                show: true,
                type: "alert-danger",
                icon: "fa-ban",
                title: "Error!",
                message: e.message + ": "+ e.response.data
            }
        }finally {
            this.modal_shown = false;
            this.is_saving = false;
        }
    }
}
