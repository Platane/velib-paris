import {delaunay, computeCircle}  from '../../../front/math/delaunay'
import {squareDistance}  from '../../../front/math/primitive/point'
import {assert}  from '../../assert'

const consistency = (triangles, points) =>


    // for all triangle, there is no point inside the circonscrit circle
    !triangles.some( triangle => {

        const c = computeCircle( triangle.map( i => points[i] ) )

        return points
            .filter( (_, i) => !triangle.some( j => i == j ) )
            .filter( p => squareDistance( p, c ) <= c.r )
            .length
    })

    &&

    // all triangle have same orientation
    triangles.every( triangle => {

        const [a, b, c] = triangle

        const ab = {x: points[b].x - points[a].x, y: points[b].y - points[a].y }
        const ac = {x: points[c].x - points[a].x, y: points[c].y - points[a].y }

        return ab.x * ac.y - ab.y * ac.x >= 0
    })


    &&

    // each point is in at least one triangle
    points.every( (_, i) =>
        triangles.some( triangle => triangle.some( j => i == j ) )
    )



let samples = [
    [
        {x:0, y:10},
        {x:0, y:0},
        {x:10, y:20},
    ],
    [
        {x:0, y:10},
        {x:2, y:20},
        {x:0, y:30},
    ],
    [
        {x:0, y:10},
        {x:0, y:20},
        {x:0, y:30},
        {x:0, y:40},
        {x:0, y:55},
        {x:10, y:55},
    ],
    [
        {x:80, y:20},
        {x:0, y:10},
        {x:40, y:20},
        {x:0, y:30},
        {x:20, y:5},
        {x:0, y:20},
        {x:40, y:30},
        {x:40, y:10},
    ],

    // [{x:14.963173,y:58.791971},{x:17.499413,y:54.959994},{x:17.877851,y:57.787527},{x:16.599494,y:61.067688},{x:15.084517,y:63.057186},{x:17.268413,y:60.589861},{x:18.830852,y:62.937586},{x:17.32607,y:63.918733},{x:16.993294,y:67.416513},{x:16.258312,y:64.199536},{x:18.560209,y:66.208215},{x:20.684645,y:63.728346},{x:19.674618,y:58.969314},{x:19.122822,y:60.269085},{x:20.5266,y:49.595619},{x:19.745359,y:51.963078},{x:19.187511,y:54.193186},{x:19.085068,y:58.826434},{x:21.404632,y:53.513418},{x:17.525166,y:43.325357},{x:17.142092,y:42.369284},{x:18.633725,y:43.650082},{x:19.204641,y:45.709297},{x:18.917023,y:35.685749},{x:18.194897,y:45.518505},{x:16.284164,y:53.512163},{x:19.713845,y:37.685016},{x:15.74978,y:41.362125},{x:16.883406,y:53.287768},{x:16.521668,y:41.166016},{x:15.562478,y:47.646601},{x:15.633056,y:46.941532},{x:15.421527,y:48.625351},{x:15.241241,y:51.451876},{x:14.335447,y:58.786582},{x:13.530806,y:49.976889},{x:12.190789,y:53.009641},{x:11.46623,y:55.932089},{x:13.698523,y:63.535209},{x:14.738407,y:70.633426},{x:12.357969,y:65.885267},{x:14.515244,y:74.337226},{x:11.053248,y:69.06192},{x:12.811962,y:68.528836},{x:12.365981,y:63.572667},{x:11.762015,y:61.883191},{x:12.484829,y:67.471763},{x:11.285858,y:72.92556},{x:12.310944,y:69.358179},{x:14.227702,y:70.282696},{x:18.566845,y:77.245339},{x:17.784892,y:73.703906},{x:17.353845,y:68.924425},{x:16.757574,y:76.00677},{x:16.833965,y:67.723663},{x:15.937266,y:74.493529},{x:15.53338,y:68.534899},{x:15.904303,y:76.897918},{x:17.944018,y:72.685644},{x:18.65595,y:66.856105},{x:19.828939,y:67.946007},{x:20.746603,y:67.596455},{x:19.027027,y:70.373255},{x:21.957043,y:67.732096},{x:18.921561,y:74.947399},{x:20.78027,y:77.78586},{x:22.563757,y:68.520967},{x:20.761496,y:69.085559},{x:19.315984,y:73.614137},{x:22.401576,y:53.523933},{x:24.418699,y:50.458104},{x:25.617476,y:46.954863},{x:23.547935,y:54.257281},{x:22.058252,y:54.914559},{x:22.515678,y:62.217169},{x:21.859502,y:65.761935},{x:21.069058,y:61.449853},{x:21.247033,y:58.637563},{x:22.394968,y:61.555081},{x:23.8134,y:52.415031},{x:22.493753,y:49.092011},{x:22.990552,y:44.824215},{x:25.369923,y:45.822139},{x:25.623053,y:41.201913},{x:24.00057,y:41.272102},{x:23.995922,y:31.907849},{x:26.102503,y:38.608319},{x:21.694013,y:44.745887},{x:24.205397,y:39.4959},{x:28.232976,y:42.558462},{x:31.537048,y:37.647254},{x:17.913213,y:33.338212},{x:19.411178,y:30.299868},{x:20.762945,y:41.149646},{x:21.71248,y:37.691073},{x:18.32415,y:19.728725},{x:19.763319,y:23.56498},{x:20.204831,y:23.711161},{x:20.914233,y:16.812352},{x:21.712221,y:25.785012},{x:22.268624,y:27.03295},{x:20.238276,y:36.304782},{x:19.635949,y:18.092407},{x:21.169072,y:17.459089},{x:21.067315,y:39.202041},{x:17.359878,y:37.025989},{x:16.333647,y:28.751578},{x:17.737788,y:16.177548},{x:14.487994,y:18.298429},{x:14.80121,y:28.309172},{x:14.535782,y:32.110444},{x:15.67802,y:32.838332},{x:12.950727,y:22.989047},{x:16.947954,y:34.382634},{x:14.455885,y:37.93581},{x:16.16187,y:13.301809},{x:13.637536,y:39.220731},{x:11.645493,y:44.399666},{x:12.920808,y:34.86671},{x:10.838334,y:45.626453},{x:10.201766,y:49.713118},{x:10.0045,y:43.384227},{x:11.484691,y:38.250331},{x:11.596365,y:27.119805},{x:10.224758,y:28.740415},{x:9.571364,y:36.553716},{x:8.073095,y:42.896461},{x:8.462798,y:44.935626},{x:10.658225,y:52.918425},{x:10.607386,y:48.32274},{x:12.989577,y:37.359712},{x:11.772664,y:34.025456},{x:9.079151,y:70.496342},{x:10.293946,y:61.87409},{x:7.63526,y:65.179086},{x:7.78046,y:59.091884},{x:8.465577,y:55.38958},{x:6.775946,y:51.080266},{x:6.77599,y:46.011319},{x:5.843474,y:43.767107},{x:5.237487,y:36.127637},{x:10.14598,y:68.538316},{x:7.455813,y:58.454936},{x:5.296192,y:39.23536},{x:6.63267,y:60.874947},{x:14.276795,y:82.359116},{x:14.153085,y:85.664198},{x:13.333293,y:77.272624},{x:12.425646,y:78.345187},{x:11.896412,y:73.918076},{x:10.679324,y:77.234397},{x:10.238555,y:75.81847},{x:9.112072,y:72.573138},{x:11.181742,y:77.336116},{x:9.000586,y:75.735799},{x:13.963625,y:82.12591},{x:16.167531,y:80.040758},{x:17.849418,y:78.05227},{x:20.672791,y:84.241339},{x:17.602165,y:82.127725},{x:17.97342,y:82.804477},{x:17.261075,y:84.278191},{x:18.061108,y:86.419601},{x:19.043211,y:85.497001},{x:16.69654,y:76.522756},{x:15.302113,y:82.925031},{x:19.07705,y:87.594508},{x:16.276617,y:81.730093},{x:22.065773,y:85.174045},{x:22.533617,y:82.621009},{x:23.830028,y:84.638085},{x:24.955055,y:81.192114},{x:23.312608,y:72.734836},{x:22.588143,y:77.341774},{x:24.421116,y:70.793989},{x:23.077097,y:68.830038},{x:22.439581,y:88.524478},{x:22.260502,y:72.069084},{x:26.490916,y:75.770534},{x:27.830312,y:47.701315},{x:26.782062,y:53.513414},{x:27.319804,y:54.854322},{x:25.705675,y:62.29144},{x:24.228839,y:62.417783},{x:25.873284,y:66.779445},{x:22.804668,y:67.210838},{x:27.654006,y:59.480187},{x:26.815442,y:65.734553},{x:27.549403,y:61.452892},{x:24.857629,y:65.290277},{x:2.251247,y:46.779906},{x:1.655047,y:40.225182},{x:1.731102,y:30.597149},{x:3.472143,y:26.790489},{x:5.095993,y:31.554805},{x:13.338596,y:91.333756},{x:12.972643,y:93.367476},{x:15.41486,y:13.618139},{x:13.881503,y:11.550086},{x:4.636922,y:16.281868},{x:6.092819,y:27.870868},{x:0.557547,y:64.150813},{x:10.115602,y:18.10476},{x:7.022377,y:82.496028},{x:5.54843,y:76.756345},{x:8.247245,y:73.926836},{x:11.188619,y:19.811817},{x:11.096189,y:11.209997},{x:10.488455,y:88.167892},{x:9.652408,y:81.174438},{x:2.220852,y:74.744835},{x:29.89469,y:54.227572},{x:32.610221,y:54.705853},{x:29.545159,y:66.758862},{x:28.200663,y:56.135763},{x:19.805081,y:100},{x:29.680959,y:75.274899},{x:23.555698,y:92.287065},{x:22.407573,y:97.431989},{x:26.499838,y:77.219652},{x:18.45474,y:91.28985},{x:16.352211,y:97.552273},{x:26.109957,y:87.537901},{x:26.431807,y:82.921982},{x:16.762078,y:0},{x:36.326181,y:34.650883},{x:28.646956,y:47.744832},{x:25.545359,y:15.719606},{x:22.385454,y:1.150116},{x:24.694998,y:9.853779},{x:27.255844,y:17.352558},{x:17.822988,y:5.079259},{x:19.271134,y:1.087357},{x:20.367834,y:10.493464},{x:30.918981,y:46.06133},{x:33.630818,y:48.155895},{x:17.625503,y:60.720535},{x:22.325344,y:79.676438},{x:27.390061,y:65.496358},{x:16.466308,y:3.144536},{x:18.472348,y:68.224808},{x:26.164685,y:74.315972},{x:23.000181,y:88.625729},{x:25.451661,y:87.393191},{x:20.911513,y:35.988528},{x:23.792008,y:41.522305},{x:22.269876,y:35.693637},{x:18.269604,y:55.72605},{x:17.882621,y:57.090663},{x:16.428804,y:63.227057},{x:15.852132,y:64.703879},{x:18.355646,y:61.14185},{x:18.50707,y:63.646164},{x:17.204251,y:65.240925},{x:16.148026,y:65.461607},{x:17.90611,y:64.067094},{x:17.447746,y:67.246544},{x:20.1213,y:62.930275},{x:19.327355,y:59.745999},{x:19.525654,y:65.058974},{x:21.040192,y:46.229152},{x:19.864681,y:53.783084},{x:18.944492,y:55.087},{x:21.400496,y:51.947559},{x:17.785786,y:49.886158},{x:17.700786,y:45.064533},{x:18.035801,y:43.729432},{x:18.563021,y:45.146714},{x:19.032593,y:44.849649},{x:19.502107,y:39.707328},{x:17.849196,y:50.935609},{x:17.511658,y:46.676118},{x:15.899491,y:49.948445},{x:16.281699,y:42.347096},{x:17.235853,y:53.326406},{x:17.632519,y:51.144519},{x:15.073737,y:47.581351},{x:17.565312,y:49.184116},{x:14.504961,y:45.5603},{x:15.147878,y:53.477196},{x:13.560729,y:58.252853},{x:13.629726,y:55.139556},{x:12.354705,y:54.551601},{x:10.390497,y:54.426173},{x:11.173487,y:67.631808},{x:15.264906,y:70.1887},{x:14.357396,y:69.104794},{x:14.295749,y:76.068606},{x:12.88093,y:62.250168},{x:12.605801,y:70.190632},{x:12.51044,y:66.611579},{x:11.425425,y:62.11923},{x:14.3578,y:75.883973},{x:10.884717,y:70.65336},{x:11.376643,y:69.538947},{x:11.416208,y:67.332397},{x:18.16851,y:76.665971},{x:18.090372,y:71.64655},{x:17.356657,y:70.614322},{x:16.757775,y:75.28123},{x:16.555179,y:69.022173},{x:16.184219,y:71.855263},{x:15.282202,y:66.171341},{x:17.759301,y:70.866616},{x:16.968177,y:70.462725},{x:19.222671,y:66.955553},{x:20.337966,y:67.044504},{x:20.536599,y:69.619704},{x:18.886116,y:72.049861},{x:21.050773,y:72.307824},{x:20.701508,y:75.94939},{x:21.211659,y:77.393365},{x:19.601453,y:77.625098},{x:21.619398,y:67.361167},{x:19.360485,y:74.035432},{x:22.224017,y:50.516128},{x:24.818714,y:47.694868},{x:25.038375,y:50.107866},{x:24.620169,y:56.180099},{x:23.288786,y:58.628173},{x:22.08413,y:61.567323},{x:21.318631,y:64.867471},{x:22.459563,y:58.297776},{x:23.183655,y:50.771214},{x:23.643196,y:49.839937},{x:21.535405,y:63.254936},{x:22.937427,y:48.813165},{x:26.292768,y:36.060995},{x:26.006283,y:45.496899},{x:27.631564,y:42.975322},{x:24.522228,y:40.55142},{x:24.030627,y:30.633139},{x:26.16136,y:33.281057},{x:22.601407,y:40.534947},{x:24.350641,y:32.119565},{x:28.314241,y:44.9701},{x:31.945605,y:35.619184},{x:18.038256,y:28.825121},{x:18.766303,y:28.131877},{x:21.814886,y:30.912753},{x:17.562177,y:23.783852},{x:19.342015,y:20.713547},{x:19.980799,y:18.231758},{x:20.928726,y:24.747414},{x:21.419215,y:19.160756},{x:22.372881,y:23.423269},{x:22.503185,y:27.508163},{x:20.988453,y:42.402291},{x:19.184413,y:15.201362},{x:22.521559,y:21.880403},{x:20.67859,y:40.464107},{x:16.171024,y:31.518582},{x:15.159353,y:25.331041},{x:17.232797,y:17.05601},{x:14.088988,y:22.046546},{x:14.152609,y:29.109006},{x:15.106783,y:30.83879},{x:14.587009,y:23.419812},{x:14.74609,y:20.827753},{x:17.474624,y:33.612087},{x:15.312531,y:19.152529},{x:14.966329,y:41.465083},{x:13.251765,y:41.275106},{x:11.726665,y:41.895829},{x:12.3951,y:35.117193},{x:11.278258,y:47.120541},{x:9.522749,y:48.977945},{x:10.516764,y:43.027063},{x:11.662015,y:34.580835},{x:10.804615,y:28.441549},{x:9.504028,y:30.495503},{x:9.002008,y:35.255648},{x:9.067861,y:33.234677},{x:10.375608,y:51.027623},{x:9.135967,y:49.497749},{x:9.263718,y:31.976888},{x:13.755416,y:37.54116},{x:10.903209,y:46.485354},{x:8.30932,y:72.718422},{x:10.039601,y:64.019772},{x:8.00515,y:61.151978},{x:7.356301,y:61.442287},{x:9.065917,y:56.122807},{x:7.359351,y:49.345178},{x:6.303218,y:46.90211},{x:6.372059,y:43.684147},{x:8.09573,y:55.602465},{x:9.759312,y:67.345483},{x:7.952517,y:57.037733},{x:7.081051,y:73.35169},{x:7.771156,y:68.192465},{x:14.797975,y:83.659078},{x:13.537269,y:85.208946},{x:13.856808,y:80.736814},{x:12.193542,y:77.740271},{x:11.55552,y:75.839263},{x:10.039606,y:78.768035},{x:9.668712,y:71.300864},{x:9.249119,y:74.556729},{x:13.438093,y:76.267439},{x:8.756582,y:77.124426},{x:15.71528,y:88.575101},{x:18.29902,y:78.524273},{x:18.698741,y:78.444208},{x:19.58056,y:81.251918},{x:16.97699,y:81.867338},{x:18.569265,y:82.450291},{x:16.697109,y:84.653169},{x:17.828519,y:87.65387},{x:20.185186,y:85.996167},{x:16.280272,y:77.176402},{x:18.687538,y:86.180096},{x:19.231284,y:78.064093},{x:16.314631,y:88.035537},{x:21.747923,y:81.62053},{x:22.9811,y:84.1404},{x:22.32152,y:76.501264},{x:25.094307,y:79.362439},{x:24.409736,y:74.02248},{x:24.027489,y:76.758831},{x:22.342152,y:74.192615},{x:24.86826,y:78.113676},{x:25.437982,y:72.712473},{x:22.637615,y:74.826895},{x:22.878703,y:81.195116},{x:26.947103,y:48.667096},{x:26.031235,y:52.063848},{x:26.087308,y:58.42042},{x:26.168508,y:64.456258},{x:24.466819,y:63.065658},{x:26.603821,y:67.266247},{x:24.816454,y:68.007182},{x:28.300448,y:50.793925},{x:26.897957,y:70.68168},{x:26.380672,y:52.013709},{x:27.307505,y:57.783021},{x:3.516458,y:41.796262},{x:0.847395,y:39.27451},{x:1.800536,y:28.784312},{x:3.177809,y:31.87119},{x:11.072749,y:91.246704},{x:12.643194,y:89.941263},{x:12.489534,y:95.180119},{x:15.147686,y:7.838536},{x:14.285193,y:8.546554},{x:4.219799,y:18.081913},{x:6.797538,y:19.983991},{x:0.774022,y:67.04705},{x:9.251306,y:18.860943},{x:6.105738,y:81.087892},{x:4.90476,y:70.639217},{x:8.081948,y:76.539843},{x:11.813284,y:18.580342},{x:9.544747,y:10.514451},{x:10.925832,y:86.605645},{x:9.077037,y:83.583107},{x:29.162191,y:47.667332},{x:29.603614,y:51.912701},{x:32.34013,y:56.608604},{x:29.487059,y:70.563213},{x:28.241275,y:69.90222},{x:19.94878,y:95.508921},{x:28.983509,y:75.33364},{x:24.495666,y:93.98193},{x:22.574825,y:99.971585},{x:15.021691,y:90.105257},{x:17.824497,y:93.927174},{x:16.084756,y:99.322393},{x:26.109269,y:86.358751},{x:26.976685,y:82.475493},{x:15.336373,y:5.215855},{x:37.656481,y:35.019315},{x:28.793004,y:34.612292},{x:26.374272,y:10.547184},{x:23.676505,y:5.750639},{x:22.25955,y:15.113192},{x:27.870191,y:19.368957},{x:18.238035,y:8.604456},{x:19.903471,y:5.284701},{x:28.989098,y:44.891338},{x:30.532697,y:40.114981},{x:35.396761,y:16.826569},{x:17.530581,y:59.54755},{x:27.480821,y:56.338579},{x:27.226275,y:68.495445},{x:28.664504,y:85.055465},{x:19.984202,y:66.848269},{x:20.299312,y:88.303979},{x:27.510525,y:45.52074},{x:20.435799,y:7.660278},{x:15.293961,y:70.931932},{x:34.62753,y:19.848198},{x:11.675958,y:50.405009},{x:18.358892,y:56.81191},{x:17.471177,y:60.212595},{x:15.86295,y:62.443844},{x:16.489239,y:60.647821},{x:16.422221,y:63.506882},{x:17.985416,y:61.970394},{x:17.706572,y:66.857272},{x:16.373337,y:66.634172},{x:18.107979,y:66.863139},{x:21.317338,y:55.819646},{x:20.40213,y:61.545711},{x:19.626187,y:62.455074},{x:18.616491,y:52.120023},{x:21.377064,y:50.797393},{x:19.970899,y:56.239036},{x:18.739034,y:55.779669},{x:19.289225,y:55.061482},{x:17.977716,y:48.69085},{x:18.297599,y:47.371038},{x:17.916361,y:41.172955},{x:18.732105,y:46.862106},{x:19.548181,y:44.190967},{x:16.84792,y:38.729744},{x:19.250771,y:39.132917},{x:19.066455,y:48.830143},{x:15.336892,y:46.029983},{x:16.130387,y:45.261877},{x:17.113844,y:51.904808},{x:16.482111,y:54.366594},{x:14.936911,y:44.68952},{x:16.02107,y:50.797676},{x:13.757681,y:46.272094},{x:15.987477,y:56.62647},{x:14.114864,y:56.738682},{x:12.772584,y:58.697567},{x:11.932883,y:56.365518},{x:15.283133,y:50.503374},{x:14.797631,y:66.56131},{x:15.256982,y:74.038176},{x:14.851763,y:68.872722},{x:13.712661,y:69.330369},{x:12.514694,y:63.91871},{x:13.315824,y:71.645555},{x:12.020537,y:66.266712},{x:11.57546,y:64.660575},{x:11.384938,y:68.607558},{x:11.013993,y:70.30037},{x:11.744017,y:65.802645},{x:11.553297,y:66.550637},{x:17.958479,y:76.448663},{x:17.886557,y:71.742572},{x:17.214277,y:71.663498},{x:16.832368,y:73.977736},{x:16.563938,y:71.470721},{x:16.077947,y:70.497078},{x:15.39046,y:72.575712},{x:15.850773,y:71.752762},{x:18.312514,y:71.01471},{x:18.471399,y:69.504229},{x:20.501944,y:65.443554},{x:20.141806,y:70.373744},{x:19.367556,y:72.256036},{x:20.52569,y:73.818145},{x:21.64506,y:68.587861},{x:21.359033,y:75.375257},{x:18.89482,y:66.44087},{x:21.147081,y:70.178054},{x:20.099169,y:70.891371},{x:22.954877,y:54.363228},{x:22.022645,y:59.166276},{x:25.453781,y:52.296984},{x:23.361354,y:55.781706},{x:22.692774,y:59.456528},{x:22.78874,y:64.467134},{x:20.899804,y:64.519798},{x:21.526463,y:61.648387},{x:24.43714,y:51.105745},{x:21.795194,y:63.096718},{x:21.52486,y:49.632881},{x:21.882169,y:42.797779},{x:23.4757,y:43.459504},{x:26.23058,y:43.714588},{x:26.666664,y:39.526397},{x:24.521574,y:37.451647},{x:25.602791,y:33.169124},{x:25.84197,y:29.862681},{x:22.96377,y:42.558572},{x:25.623608,y:36.188183},{x:27.464485,y:23.279274},{x:28.72676,y:21.953867},{x:18.498287,y:33.979534},{x:19.68912,y:29.856802},{x:23.047517,y:29.175042},{x:18.57016,y:25.483001},{x:17.855659,y:12.432109},{x:20.087899,y:16.756869},{x:20.625523,y:22.279632},{x:20.772033,y:29.184756},{x:22.767213,y:19.931779},{x:22.69766,y:29.494193},{x:19.328782,y:28.014271},{x:20.400918,y:21.075727},{x:22.910677,y:18.207888},{x:14.967387,y:39.783761},{x:16.794716,y:31.571089},{x:16.033022,y:25.439812},{x:16.658051,y:22.35989},{x:12.525704,y:21.097926},{x:13.607603,y:29.917988},{x:15.529732,y:34.187704},{x:14.795981,y:40.132936},{x:15.466916,y:19.596589},{x:13.947817,y:35.858113},{x:12.746421,y:24.305679},{x:14.675114,y:42.361309},{x:13.011448,y:43.430837},{x:12.348862,y:42.157992},{x:12.048636,y:38.677982},{x:11.578208,y:49.260289},{x:9.102746,y:46.536713},{x:10.243367,y:41.084313},{x:12.684247,y:32.550418},{x:10.30396,y:26.155982},{x:10.432704,y:34.500422},{x:8.273881,y:35.077469},{x:9.319664,y:40.771414},{x:7.047428,y:36.759568},{x:7.74559,y:42.03408},{x:8.61829,y:41.067111},{x:14.066173,y:39.953194},{x:7.96836,y:31.602365},{x:7.711482,y:66.838494},{x:9.302582,y:63.189077},{x:9.397508,y:60.690837},{x:6.823219,y:60.236313},{x:8.525927,y:51.147073},{x:8.124524,y:49.678594},{x:5.630811,y:46.445105},{x:6.177387,y:39.589815},{x:4.391266,y:37.31337},{x:8.629743,y:66.885402},{x:8.779654,y:54.864716},{x:5.325895,y:74.43451},{x:15.312036,y:84.224425},{x:14.639121,y:77.594083},{x:14.715428,y:86.505406},{x:13.514378,y:79.938105},{x:11.990631,y:79.884647},{x:11.138096,y:78.494676},{x:9.722127,y:79.501693},{x:9.708325,y:72.898624},{x:15.562473,y:87.968885},{x:14.877512,y:76.81672},{x:10.398605,y:78.995935},{x:11.410073,y:83.487579},{x:16.204044,y:79.414038},{x:19.177518,y:79.575379},{x:18.783011,y:80.428063},{x:15.899977,y:82.672921},{x:18.895849,y:83.023146},{x:16.101808,y:85.139396},{x:16.954264,y:87.074248},{x:21.178815,y:79.846823},{x:15.605298,y:77.61415},{x:20.001921,y:86.921295},{x:21.44343,y:85.900925},{x:16.413276,y:80.268796},{x:21.60962,y:77.761037},{x:23.37175,y:85.576997},{x:23.116768,y:77.966326},{x:24.592588,y:78.029374},{x:24.92726,y:75.914773},{x:23.264181,y:86.529753},{x:25.946738,y:70.863776},{x:25.399042,y:77.250025},{x:22.898736,y:73.794379},{x:23.991026,y:72.385058},{x:25.990784,y:46.841935},{x:26.247103,y:49.91975},{x:25.985838,y:53.379702},{x:26.516083,y:59.975008},{x:25.215948,y:62.112335},{x:23.849545,y:64.561729},{x:27.63604,y:69.156522},{x:25.791822,y:49.906133},{x:25.871358,y:62.255315},{x:25.47272,y:63.977552},{x:27.30816,y:53.59116},{x:24.505273,y:56.997954},{x:2.169481,y:44.211662},{x:3.494491,y:36.505504},{x:3.898059,y:23.573345},{x:4.166839,y:26.231359},{x:12.838002,y:87.378484},{x:11.980303,y:89.00749},{x:13.111368,y:96.773942},{x:14.446029,y:11.378288},{x:13.530207,y:6.073549},{x:4.021579,y:20.866794},{x:7.327877,y:21.171879},{x:1.08313,y:66.978147},{x:9.752481,y:21.036644},{x:5.719171,y:79.604493},{x:6.285828,y:76.697676},{x:6.675895,y:78.399404},{x:13.358791,y:19.014478},{x:8.113028,y:84.811945},{x:10.657121,y:82.757883},{x:9.050501,y:79.586384},{x:28.851477,y:51.036533},{x:30.792692,y:55.309137},{x:32.10277,y:53.79556},{x:30.114107,y:69.468954},{x:29.326124,y:54.922658},{x:20.90242,y:93.536895},{x:29.4319,y:76.087571},{x:23.837677,y:96.578643},{x:24.715801,y:99.535865},{x:15.855067,y:91.317482},{x:16.861497,y:93.268917},{x:25.926858,y:96.574141},{x:27.355692,y:86.811058},{x:28.119706,y:81.722181},{x:36.623792,y:44.857237},{x:28.57387,y:37.636353},{x:25.290984,y:17.257145},{x:23.311972,y:13.240293},{x:24.979098,y:19.336963},{x:22.650904,y:11.935393},{x:27.491211,y:21.246493},{x:16.080652,y:8.64041},{x:20.563674,y:4.146248},{x:29.860138,y:47.332933},{x:31.864552,y:46.73967},{x:34.696237,y:10.966588},{x:21.170069,y:33.318593},{x:27.440943,y:60.623968},{x:12.34321,y:60.109312},{x:27.565766,y:51.134552},{x:14.68639,y:81.325266},{x:21.577403,y:88.352557},{x:27.546314,y:45.850301},{x:20.971523,y:63.506324},{x:34.049382,y:32.395368},{x:34.852935,y:37.442454},{x:13.831759,y:60.336467},{x:18.232516,y:57.477353},{x:17.026962,y:59.715542},{x:15.696678,y:61.773154},{x:17.639862,y:60.887908},{x:18.951645,y:62.15909},{x:17.524649,y:62.814765},{x:16.963973,y:64.774114},{x:18.734439,y:65.079334},{x:18.043261,y:62.870147},{x:20.861015,y:55.923018},{x:20.089962,y:59.690096},{x:19.243053,y:64.093099},{x:18.320304,y:53.286553},{x:20.299458,y:50.954512},{x:19.574818,y:57.03741},{x:18.98408,y:56.524395},{x:18.739575,y:59.235114},{x:17.437489,y:44.79561},{x:18.13301,y:49.319185},{x:18.495295,y:40.260854},{x:19.141967,y:48.104191},{x:19.069114,y:41.358716},{x:17.766617,y:48.179978},{x:20.719545,y:41.777981},{x:18.985654,y:42.471123},{x:15.273636,y:41.913749},{x:16.007091,y:40.36723},{x:17.454702,y:50.644531},{x:16.585598,y:49.959535},{x:16.974499,y:50.045349},{x:15.845298,y:48.678174},{x:14.377325,y:47.045404},{x:15.16648,y:57.311536},{x:14.236318,y:52.382019},{x:12.890318,y:55.127241},{x:11.718275,y:59.021589},{x:14.191682,y:55.626071},{x:14.964582,y:65.442153},{x:14.977317,y:75.112429},{x:14.716042,y:71.223758},{x:13.652532,y:70.718139},{x:12.957168,y:65.963168},{x:12.80781,y:72.336281},{x:11.860555,y:66.785735},{x:11.171406,y:65.240941},{x:11.648179,y:70.141452},{x:15.265206,y:72.801649},{x:15.091407,y:70.20109},{x:18.497835,y:72.37315},{x:18.160113,y:76.036158},{x:17.904246,y:69.34801},{x:17.212091,y:72.58975},{x:16.869862,y:72.671394},{x:16.322798,y:73.892488},{x:16.215561,y:69.76034},{x:15.715529,y:72.865318},{x:15.556581,y:69.941121},{x:20.166514,y:64.943524},{x:19.297745,y:68.654433},{x:20.071897,y:68.925005},{x:19.702051,y:69.998225},{x:19.602861,y:71.861386},{x:19.933666,y:73.858088},{x:19.062978,y:75.128541},{x:21.604009,y:72.388094},{x:19.049657,y:75.912077},{x:21.354198,y:71.270816},{x:21.590872,y:51.994555},{x:23.543357,y:51.477503},{x:25.012056,y:48.876367},{x:22.842944,y:61.26911},{x:23.618417,y:56.398749},{x:23.230894,y:60.933427},{x:21.715745,y:54.759655},{x:20.948536,y:62.593474},{x:21.203293,y:59.90834},{x:21.778644,y:57.604564},{x:24.063268,y:56.89475},{x:21.708249,y:47.653603},{x:22.249844,y:44.261134},{x:23.933643,y:45.816854},{x:26.772007,y:43.231691},{x:27.565844,y:39.388161},{x:24.82475,y:35.220796},{x:25.239633,y:38.92535},{x:27.996181,y:32.062748},{x:24.596825,y:46.160731},{x:25.248746,y:32.239016},{x:28.700024,y:25.660603},{x:22.022413,y:44.091848},{x:19.747671,y:36.7394},{x:19.910123,y:33.90128},{x:20.515505,y:30.866281},{x:19.151393,y:26.62587},{x:18.903655,y:17.472866},{x:20.202876,y:13.698799},{x:20.658988,y:19.09793},{x:21.256333,y:30.594799},{x:17.873193,y:24.296096},{x:23.13052,y:26.617531},{x:17.531532,y:26.88581},{x:21.303115,y:22.409235},{x:24.354155,y:22.56936},{x:15.71478,y:37.807948},{x:17.362397,y:29.624994},{x:17.043968,y:24.529352},{x:15.054311,y:20.189259},{x:12.219107,y:25.951897},{x:13.34899,y:32.699997},{x:14.227262,y:34.699693},{x:14.862392,y:33.544629},{x:14.420752,y:25.683805},{x:13.814682,y:21.40453},{x:16.333939,y:18.176571},{x:14.354865,y:41.705871},{x:12.421099,y:45.7006},{x:12.572862,y:39.948427},{x:11.176565,y:40.337738},{x:10.907397,y:49.766997},{x:9.911569,y:46.656007},{x:10.677765,y:41.69703},{x:12.398607,y:31.214012},{x:11.729749,y:30.525295},{x:10.742973,y:36.252547},{x:7.230611,y:38.715088},{x:8.931258,y:41.913652},{x:9.689086,y:39.877119},{x:7.836671,y:36.254787},{x:8.613698,y:34.738612},{x:14.646637,y:41.818196},{x:9.250131,y:29.338448},{x:9.204311,y:66.464367},{x:8.880162,y:62.688386},{x:10.82533,y:64.642402},{x:6.160255,y:55.22272},{x:7.814712,y:51.011205},{x:7.518419,y:46.172093},{x:5.190501,y:47.346086},{x:5.508092,y:41.724854},{x:8.967643,y:71.720572},{x:7.835943,y:62.798115},{x:5.963094,y:50.854851},{x:3.955961,y:70.423742},{x:14.960311,y:80.519239},{x:14.678999,y:88.585004},{x:13.80012,y:78.629385},{x:12.781195,y:75.291454},{x:11.894949,y:82.55191},{x:10.85026,y:81.202699},{x:10.471488,y:70.784246},{x:9.626126,y:74.22281},{x:11.07144,y:73.103132},{x:9.672568,y:77.780404},{x:14.335796,y:89.136085},{x:12.870209,y:80.735791},{x:17.069725,y:77.890044},{x:19.710666,y:79.151059},{x:19.230254,y:80.841232},{x:16.57722,y:83.520088},{x:18.507657,y:83.205808},{x:17.469166,y:85.48903},{x:16.276144,y:86.808439},{x:20.20245,y:77.958046},{x:15.237418,y:79.544785},{x:20.863577,y:88.678107},{x:20.58857,y:81.806188},{x:16.455781,y:78.490548},{x:21.791838,y:77.045843},{x:23.778783,y:86.969651},{x:23.592279,y:81.471746},{x:23.276887,y:76.415744},{x:25.71765,y:74.851912},{x:25.71035,y:78.857386},{x:23.99039,y:69.813311},{x:22.025363,y:90.62647},{x:21.672983,y:75.536396},{x:24.995257,y:70.767684},{x:25.441886,y:69.365824},{x:26.884888,y:51.438185},{x:25.801915,y:55.006838},{x:26.608225,y:61.95215},{x:27.642373,y:72.853673},{x:24.531952,y:64.965975},{x:23.28596,y:65.316041},{x:26.529688,y:57.371701},{x:27.889343,y:49.608565},{x:24.479333,y:69.602943},{x:25.541179,y:66.322165},{x:26.600501,y:50.806363},{x:2.580409,y:38.643158},{x:2.730825,y:36.582366},{x:2.783223,y:29.691548},{x:3.757717,y:33.33154},{x:13.896148,y:90.512557},{x:12.300554,y:92.045211},{x:10.895129,y:88.999364},{x:12.405212,y:9.512464},{x:14.906277,y:14.301599},{x:5.642021,y:17.994602},{x:7.327289,y:24.780239},{x:8.606394,y:13.252524},{x:10.877545,y:20.698784},{x:5.758295,y:78.064426},{x:7.270143,y:75.31357},{x:8.179434,y:80.442781},{x:12.484577,y:13.994604},{x:8.341472,y:88.278529},{x:10.241456,y:82.396966},{x:2.896048,y:73.340461},{x:28.77322,y:52.973099},{x:31.495088,y:55.511601},{x:30.034591,y:56.193206},{x:28.392418,y:61.543126},{x:19.942866,y:94.041807},{x:27.767323,y:73.247242},{x:28.793703,y:76.923228},{x:22.928222,y:95.024814},{x:27.11873,y:79.467912},{x:16.555823,y:90.417619},{x:15.999077,y:93.529634},{x:25.459007,y:94.567737},{x:27.859474,y:84.147597},{x:28.93079,y:81.724131},{x:35.258757,y:42.28782},{x:28.70663,y:42.162162},{x:24.854869,y:10.81592},{x:21.729741,y:8.310493},{x:23.050016,y:4.933163},{x:26.025332,y:21.450046},{x:26.885719,y:24.477378},{x:17.400273,y:10.221344},{x:19.727684,y:7.217041},{x:30.036931,y:44.291221},{x:32.566818,y:46.292065},{x:18.668026,y:59.892145},{x:13.308918,y:39.023826},{x:26.890197,y:46.229001},{x:27.195032,y:62.020512},{x:27.376442,y:39.021577},{x:24.707043,y:80.875246},{x:25.71971,y:84.949286},{x:25.705553,y:82.368126},{x:13.054552,y:59.943094},{x:8.732199,y:47.706026},{x:16.305355,y:68.233034},{x:19.970385,y:71.499752},{x:18.619411,y:58.687904},{x:16.373797,y:60.800404},{x:15.529346,y:63.410589},{x:17.251649,y:58.800323},{x:18.163057,y:61.590362},{x:16.758595,y:63.773945},{x:16.663873,y:66.182296},{x:18.597456,y:64.426405},{x:17.518524,y:66.471605},{x:20.895616,y:59.454066},{x:20.324654,y:57.433176},{x:20.594983,y:54.835487},{x:19.01294,y:51.157965},{x:20.347056,y:53.076426},{x:19.64122,y:53.937404},{x:18.728943,y:57.648142},{x:20.645106,y:48.359592},{x:17.419502,y:40.493836},{x:18.335948,y:49.951564},{x:18.70475,y:40.135774},{x:19.60597,y:47.600174},{x:18.697286,y:37.599099},{x:19.382857,y:42.288317},{x:20.011751,y:40.543954},{x:16.633414,y:55.43361},{x:15.682968,y:43.392936},{x:16.433493,y:51.492292},{x:16.928648,y:47.999479},{x:15.80237,y:52.081416},{x:17.395861,y:47.374801},{x:16.922061,y:41.981731},{x:15.058317,y:49.557037},{x:14.878052,y:56.066567},{x:13.246048,y:46.015012},{x:12.815625,y:49.617066},{x:10.744828,y:58.365993},{x:11.716633,y:54.022561},{x:15.131511,y:69.715743},{x:15.224756,y:76.983962},{x:14.28607,y:71.322573},{x:14.082757,y:72.761156},{x:13.421262,y:67.441539},{x:13.51905,y:74.058311},{x:12.157976,y:73.063867},{x:11.510422,y:66.574639},{x:11.579636,y:71.273297},{x:11.870251,y:69.161705},{x:14.657167,y:72.059194},{x:18.582453,y:73.753045},{x:18.033409,y:74.237128},{x:18.097827,y:67.496284},{x:17.356913,y:75.188917},{x:16.948031,y:68.989619},{x:16.257548,y:76.228982},{x:15.701682,y:68.680421},{x:15.516013,y:75.373884},{x:15.695517,y:68.034433},{x:19.340662,y:65.938182},{x:19.510695,y:68.233012},{x:21.090145,y:67.16125},{x:19.599192,y:70.659271},{x:20.30481,y:71.285995},{x:19.119994,y:74.665377},{x:20.178668,y:77.398077},{x:22.191817,y:69.859606},{x:21.433854,y:73.83981},{x:19.717887,y:74.084495},{x:22.135803,y:53.151855},{x:23.664572,y:48.756296},{x:25.28414,y:47.711386},{x:24.64187,y:53.606447},{x:22.93303,y:56.524324},{x:23.539298,y:63.341864},{x:22.030629,y:64.415113},{x:21.537534,y:62.644367},{x:21.811465,y:60.591157},{x:24.932574,y:53.91728},{x:24.154571,y:53.021227},{x:21.180358,y:44.453632},{x:22.648791,y:45.352839},{x:24.502651,y:42.915847},{x:25.430235,y:44.183541},{x:23.422775,y:36.298386},{x:23.900098,y:33.621692},{x:25.617548,y:38.098581},{x:22.565229,y:46.660592},{x:22.896244,y:38.639866},{x:26.411495,y:31.299308},{x:31.764531,y:42.836613},{x:17.926225,y:36.305021},{x:19.214851,y:33.57436},{x:20.315715,y:38.117875},{x:21.982242,y:34.896142},{x:18.737249,y:23.213582},{x:19.61227,y:27.095574},{x:20.327367,y:27.089705},{x:20.971469,y:20.603409},{x:21.506759,y:27.688501},{x:23.74815,y:26.370228},{x:18.430402,y:29.361681},{x:18.769003,y:19.437995},{x:21.957933,y:17.145679},{x:19.953329,y:26.135433},{x:15.970702,y:35.401707},{x:15.680276,y:29.775302},{x:17.551552,y:18.31104},{x:15.254862,y:22.6572},{x:14.07517,y:27.682709},{x:13.966319,y:32.695135},{x:14.689707,y:36.464806},{x:13.932313,y:31.516674},{x:16.655615,y:36.121502},{x:14.755777,y:17.258853},{x:16.67955,y:28.932156},{x:14.244517,y:40.435161},{x:11.807962,y:46.085248},{x:12.637677,y:36.903992},{x:11.033522,y:43.399917},{x:13.248798,y:35.107422},{x:8.718519,y:37.33483},{x:10.725113,y:39.039737},{x:7.202298,y:32.146174},{x:11.283902,y:31.559906},{x:10.150712,y:37.831252},{x:8.171552,y:39.339974},{x:8.229417,y:44.849539},{x:8.208966,y:37.232285},{x:11.07808,y:50.992425},{x:10.77262,y:33.119828},{x:7.779877,y:27.806656},{x:10.465638,y:67.222741},{x:9.913337,y:65.585595},{x:8.677827,y:64.612188},{x:8.584585,y:57.672839},{x:7.628525,y:56.164514},{x:7.057714,y:53.498358},{x:7.757311,y:54.105829},{x:5.086285,y:43.827849},{x:6.095432,y:38.841192},{x:8.68295,y:69.172705},{x:8.738308,y:60.976858},{x:6.74284,y:48.273586},{x:5.789847,y:59.409826},{x:15.47215,y:86.428764},{x:13.922983,y:84.083793},{x:12.957133,y:87.143542},{x:12.710076,y:76.429337},{x:13.796578,y:75.328041},{x:10.631921,y:75.487996},{x:10.144518,y:73.967876},{x:9.583814,y:76.639891},{x:10.585718,y:72.397799},{x:11.393934,y:80.479709},{x:14.370076,y:80.420859},{x:12.985548,y:78.23254},{x:17.518705,y:77.642252},{x:20.214677,y:82.309506},{x:18.269791,y:81.065825},{x:17.2457,y:82.893669},{x:17.904838,y:84.300763},{x:18.343944,y:84.900519},{x:16.78887,y:88.846346},{x:17.338974,y:76.104147},{x:15.212643,y:80.548826},{x:20.088267,y:84.100889},{x:20.393278,y:79.574304},{x:17.677319,y:88.942106},{x:22.184843,y:80.604539},{x:24.355627,y:90.301351},{x:24.055681,y:79.365545},{x:23.011488,y:71.564396},{x:24.89629,y:71.539045},{x:26.723687,y:71.648773},{x:23.477571,y:70.402912},{x:21.467178,y:79.242384},{x:22.716047,y:79.293604},{x:24.049614,y:82.907748},{x:28.37079,y:45.593414},{x:27.790454,y:52.156134},{x:26.673327,y:54.994176},{x:25.766299,y:61.341984},{x:24.142404,y:60.572957},{x:25.299582,y:65.714191},{x:23.71626,y:66.53769},{x:27.640077,y:64.548984},{x:26.85819,y:58.962089},{x:23.82734,y:67.840349},{x:27.96344,y:68.982988},{x:27.432931,y:51.699165},{x:2.854005,y:33.429112},{x:1.513753,y:34.004239},{x:2.875512,y:25.522816},{x:4.61505,y:30.303553},{x:14.195722,y:92.084504},{x:11.755279,y:93.11118},{x:13.039848,y:12.471232},{x:14.445698,y:14.79728},{x:11.852865,y:6.887833},{x:5.628785,y:21.634598},{x:8.249277,y:25.379252},{x:10.212093,y:15.63359},{x:10.291198,y:22.734291},{x:5.679397,y:77.74764},{x:7.170247,y:75.695482},{x:0,y:41.746342},{x:11.458697,y:16.104405},{x:9.206563,y:88.271401},{x:9.766303,y:84.500564},{x:3.736947,y:77.886636},{x:29.253787,y:53.513377},{x:30.851973,y:65.207705},{x:28.633368,y:64.904043},{x:28.312133,y:60.236468},{x:19.885566,y:96.02057},{x:28.390945,y:73.893914},{x:21.34558,y:91.736091},{x:22.972903,y:97.235212},{x:27.195021,y:77.516304},{x:17.572618,y:91.251889},{x:14.634031,y:93.204075},{x:25.038442,y:91.387933},{x:27.358632,y:83.715288},{x:27.886722,y:84.555469},{x:34.153181,y:48.515857},{x:29.504785,y:44.348914},{x:25.771111,y:10.490512},{x:23.713997,y:9.934508},{x:21.375455,y:12.012518},{x:26.853882,y:20.050077},{x:26.266791,y:27.520517},{x:18.776931,y:11.840177},{x:20.32329,y:8.198419},{x:31.07723,y:48.792739},{x:33.671375,y:45.493908},{x:18.370884,y:60.708815},{x:23.458468,y:79.320525},{x:29.173101,y:19.406581},{x:27.116802,y:34.04661},{x:9.882106,y:51.990703},{x:23.993995,y:88.379953},{x:25.336097,y:81.384732},{x:30.624561,y:33.942186},{x:23.450974,y:38.376861},{x:6.149706,y:71.448064},{x:9.890105,y:35.100979}],

    [{x:15.212643,y:80.548826},{x:20.088267,y:84.100889},{x:20.393278,y:79.574304},{x:17.677319,y:88.942106},{x:22.184843,y:80.604539},{x:24.355627,y:90.301351},{x:24.055681,y:79.365545},{x:23.011488,y:71.564396},{x:24.89629,y:71.539045},{x:26.723687,y:71.648773},{x:23.477571,y:70.402912},{x:21.467178,y:79.242384},{x:22.716047,y:79.293604},{x:24.049614,y:82.907748},{x:28.37079,y:45.593414},{x:27.790454,y:52.156134},{x:26.673327,y:54.994176},{x:25.766299,y:61.341984},{x:24.142404,y:60.572957},{x:25.299582,y:65.714191},{x:23.71626,y:66.53769},{x:27.640077,y:64.548984},{x:26.85819,y:58.962089},{x:23.82734,y:67.840349},{x:27.96344,y:68.982988},{x:27.432931,y:51.699165},{x:2.854005,y:33.429112},{x:1.513753,y:34.004239},{x:2.875512,y:25.522816},{x:4.61505,y:30.303553},{x:14.195722,y:92.084504},{x:11.755279,y:93.11118},{x:13.039848,y:12.471232},{x:14.445698,y:14.79728},{x:11.852865,y:6.887833},{x:5.628785,y:21.634598},{x:8.249277,y:25.379252},{x:10.212093,y:15.63359},{x:10.291198,y:22.734291},{x:5.679397,y:77.74764},{x:7.170247,y:75.695482},{x:0,y:41.746342},{x:11.458697,y:16.104405},{x:9.206563,y:88.271401},{x:9.766303,y:84.500564},{x:3.736947,y:77.886636},{x:29.253787,y:53.513377},{x:30.851973,y:65.207705},{x:28.633368,y:64.904043},{x:28.312133,y:60.236468},{x:19.885566,y:96.02057},{x:28.390945,y:73.893914},{x:21.34558,y:91.736091},{x:22.972903,y:97.235212},{x:27.195021,y:77.516304},{x:17.572618,y:91.251889},{x:14.634031,y:93.204075},{x:25.038442,y:91.387933},{x:27.358632,y:83.715288},{x:27.886722,y:84.555469},{x:34.153181,y:48.515857},{x:29.504785,y:44.348914},{x:25.771111,y:10.490512},{x:23.713997,y:9.934508},{x:21.375455,y:12.012518},{x:26.853882,y:20.050077},{x:26.266791,y:27.520517},{x:18.776931,y:11.840177},{x:20.32329,y:8.198419},{x:31.07723,y:48.792739},{x:33.671375,y:45.493908},{x:18.370884,y:60.708815},{x:23.458468,y:79.320525},{x:29.173101,y:19.406581},{x:27.116802,y:34.04661},{x:9.882106,y:51.990703},{x:23.993995,y:88.379953},{x:25.336097,y:81.384732},{x:30.624561,y:33.942186},{x:23.450974,y:38.376861},{x:6.149706,y:71.448064},{x:9.890105,y:35.100979}],
]

samples = [ ...samples, ...samples.map( sample => [ sample[1], sample[0], ...sample.slice(2) ] ) ]
samples = [ ...samples, ...samples.map( sample => sample.slice().reverse() ) ]

const success = samples
    .every( (points, i) => consistency( delaunay( points ), points ) || console.log( i ) )

assert( success , 'trig' )