import pandas as pd
from sklearn.metrics import confusion_matrix
from sentence_transformers import SentenceTransformer
from sklearn.cluster import AgglomerativeClustering
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
model = SentenceTransformer('all-MiniLM-L6-v2')
from sklearn.manifold import TSNE 





def cluster(distance):
    df = pd.read_csv('test.csv', header = 0, sep = ",")
    answers = df.iloc[:,1]
    student_id = df.iloc[:,0]
    sentences = []
    for answer in answers:
        sentences.append(answer)
    bert_embeddings = model.encode(answers)
    clustering_model = AgglomerativeClustering(n_clusters=None, distance_threshold=distance)
    clustering_model.fit(bert_embeddings)
    bert_label = clustering_model.labels_

    df_clusters = pd.DataFrame({
        "id": student_id,
        "text": answers,
        "agg_bert_row": bert_label,
    })
    pca = PCA(n_components=2)
    embedding_list = []
    for i in bert_embeddings:
        embedding_list.append(i)

  
    length = []
    for i in range(0,len(student_id)):
        answer_length = len(answers[i])
        length.append(answer_length)
    df_clusters["answer_length"] = length

    X_embedded = TSNE(n_components=2).fit_transform(embedding_list)
    vector_2 = pd.DataFrame(X_embedded)
    df_clusters["x_position"] = vector_2.iloc[:,0]
    df_clusters["y_position"] = vector_2.iloc[:,1]
    df_clusters

    plt.scatter(X_embedded[:, 0], X_embedded[:, 1], s=length, c=bert_label, cmap='Paired')
    plt.title("Dim=2")
    plt.colorbar()
    plt.savefig('cluster.png')
    plt.show()

    df_clusters.to_csv("cluster.csv")
    return df_clusters

def main():
    cluster_result = cluster(2)
    print(cluster_result)

if __name__ == "__main__":
    main()