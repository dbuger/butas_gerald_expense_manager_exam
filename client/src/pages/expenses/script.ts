import {Options, Vue} from 'vue-class-component'
import {useStore} from "@/store";

@Options({})
export default class Expenses extends Vue {
    private resource = "/api/expenses/";
    private store = useStore();
    private current_user = this.store.getters.getCurrentUser;

    public modal_shown = false;
    public is_saving = false;
    public add_mode = true;
    public datasets = [];
    public categories = [];
    public form_data = {
        id: -1,
        expense_category_id:"",
        amount:0,
        entry_at:Date.now()
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
        return !this.add_mode && this.hasPermission('can_delete_expense');
    }
    get can_create(){
        return this.hasPermission('can_create_expense');
    }
    get can_save() {
        if(!this.add_mode)
            return this.hasPermission('can_update_expense');
        return true;
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
        await this.getAllExpenseCategories();
    }

    public async getAll(): Promise<void> {
        const response = await this.axios.get(this.resource);
        this.datasets = response.data;
    }

    public async getAllExpenseCategories(): Promise<void> {
        const response = await this.axios.get('/api/expense_categories/');
        this.categories = response.data;
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
            expense_category_id:"",
            amount:0,
            entry_at:Date.now()
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
