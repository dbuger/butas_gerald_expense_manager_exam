import {Options, Vue} from 'vue-class-component';
import {useStore} from "@/store";

@Options({})
export default class MenuSidebar extends Vue {
    private store = useStore();

    public current_user = this.store.getters.getCurrentUser;

    get currentRoute() {
        return this.$router.currentRoute.value.name;
    }

    get canManageUser() {
        return this.hasRole("Administrator");
    }

    get canChangePassword(){
        return this.hasPermission("can_change_password")
    }
    get canManageExpenseCategories() {
        return this.hasRole("Administrator");
    }


    public hasRole(name:string){
        return this.current_user.roles.includes(name);
    }
    public hasPermission(name: string) {
        return this.current_user.permissions.includes(name);
    }
}
