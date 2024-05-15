import { useMutation, useQuery } from '@tanstack/react-query';

const useStrategies = () => {
  const strategiesQuery = useQuery({
    queryKey: ['strategies'],
    queryFn: async () => {
      const strategiesResponse = await fetch('/api/strategy').then(
        async (data) => ({ status: data.status, body: await data.json() })
      );
      if (strategiesResponse.status !== 200) {
        throw new Error(await strategiesResponse.body);
      }

      return strategiesResponse;
    },
  });

  return {
    strategiesQuery,
    data: strategiesQuery.data?.body,
    isLoading: strategiesQuery.isLoading,
    isError: strategiesQuery.isError,
    refetch: strategiesQuery.refetch,
    isPending: strategiesQuery.isPending,
  };
};

const useDeleteStrategy = () => {
  const deleteRequest = useMutation({
    mutationFn: async (id: string) => {
      const deleteResponse = await fetch(`/api/strategy/${id}`, {
        method: 'DELETE',
      }).then(async (data) => ({
        status: data.status,
        body: await data.json(),
      }));

      if (deleteResponse.status !== 200) {
        throw new Error(deleteResponse.body);
      }

      return deleteResponse;
    },
  });

  return {
    isPending: deleteRequest.isPending,
    isError: deleteRequest.isError,
    isSuccess: deleteRequest.isSuccess,
    reset: deleteRequest.reset,
    mutate: deleteRequest.mutate,
  };
};

export { useDeleteStrategy, useStrategies };
