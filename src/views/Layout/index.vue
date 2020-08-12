<template>
    <div>
        <LayoutHeader/>
        <LayoutMain/>
        <LayoutNav/>
    </div>
</template>
<script>
import LayoutHeader from './Components/Head';
import LayoutMain from './Components/Main';
import LayoutNav from './Components/Nav'
export default {
    name : 'layout',
    components : {LayoutHeader,LayoutMain,LayoutNav},
    setup(){

    }
    
}
</script>

<style scoped>

</style>