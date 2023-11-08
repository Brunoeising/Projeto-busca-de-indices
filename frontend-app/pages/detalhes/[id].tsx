import React from 'react';
import Valueindices from '../../templates/fontes/indices/index';
import { useRouter } from 'next/router';


const Indices = () => {
   const router = useRouter();
   const { id } = router.query;

   return <Valueindices fonteId={id} />;
};


export default Indices;