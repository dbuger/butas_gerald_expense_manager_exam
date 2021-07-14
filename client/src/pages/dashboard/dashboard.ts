import {Options, Vue} from 'vue-class-component'
import {PieChart} from "vue-chart-3";
import {useStore} from "@/store";

@Options({
    components: {
        PieChart
    }
})
export default class Dashboard extends Vue {
    private store = useStore();

    public options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Expenses Pie Chart",
            },
        },
    };

    public datasets = [];

    get testData(){
        return {
            labels: this.dataSetCategories,
            datasets: [
                {
                    data: this.dataSetValues,
                    backgroundColor: this.dataSetColors,
                },
            ],
        }
    };

    get dataSetCategories(){
        return this.datasets.length === 0 ? [] : this.datasets.reduce((a,c)=>{
            a.push(c['category_name'])
            return a;
        },[])
    }

    get dataSetValues(){
        return this.datasets.length === 0 ? [] : this.datasets.reduce((a,c)=>{
            a.push(c['total'])
            return a;
        },[])
    }
    get dataSetColors(){
        return this.datasets.length === 0 ? [] : this.datasets.reduce((a,c)=>{
            a.push(c['color'])
            return a;
        },[])
    }
    get has_datasets(): boolean {
        return this.datasets.length !== 0;
    }

    public async mounted(): Promise<void> {

        await this.getAll();
    }

    public async getAll(): Promise<void> {
        const response = await this.axios.get("/api/expenses/report");
        this.datasets = response.data;
    }


}
