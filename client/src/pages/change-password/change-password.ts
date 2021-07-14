import {Options, Vue} from 'vue-class-component'
import {useStore} from "@/store";

@Options({})
export default class ChangePassword extends Vue {
    private resource = "/api/user/";
    private store = useStore();
    private current_user = this.store.getters.getCurrentUser;

    public is_saving = false;
    public form_data = {
        old_password: "",
        new_password: "",
        confirm_password: ""
    };
    public permissions = [];
    public alert = {
        show:false,
        type:"alert-danger",
        icon:"fa-ban",
        title:"",
        message:""
    }


    public hasRole(name: string) {
        return this.current_user.roles.includes(name);
    }

    public hasPermission(name: string) {
        return this.current_user.permissions.includes(name);
    }

    public async save() {
        try {
            this.is_saving = true;
            const response = await this.axios.post(`${this.resource}change_password`, this.form_data);

            this.alert = {
                show: true,
                type: "alert-success",
                icon: "fa-check-circle",
                title: "Success!",
                message: "Password successfully changed."
            }
        } catch (e) {
            this.alert = {
                show: true,
                type: "alert-danger",
                icon: "fa-ban",
                title: "Error!",
                message: e.message + ": "+ e.response.data
            }
        } finally {
            this.is_saving = false;
        }

    }
}
